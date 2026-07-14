import type { Request, Response } from 'express';
import { env } from '../config/env';
import { User } from '../models/User';
import { Subscription } from '../models/Subscription';
import { QrTag } from '../models/QrTag';
import { Vehicle } from '../models/Vehicle';
import { Business } from '../models/Business';
import { CallLog } from '../models/CallLog';
import { asyncHandler, HttpError } from '../utils/asyncHandler';
import { signAdminToken } from '../utils/jwt';
import { adminCreateCustomerSchema, adminLoginSchema, upgradeSubscriptionSchema } from '../utils/zodSchemas';

export const adminLogin = asyncHandler(async (req: Request, res: Response) => {
  const { username, password } = adminLoginSchema.parse(req.body);
  if (username !== env.adminUsername || password !== env.adminPassword) {
    throw new HttpError(401, 'Invalid admin credentials.');
  }
  res.json({ token: signAdminToken() });
});

export const listCustomers = asyncHandler(async (_req: Request, res: Response) => {
  const users = await User.find().sort({ createdAt: -1 });
  const subs = await Subscription.find({ userId: { $in: users.map((u) => u._id) } });
  const subByUser = new Map(subs.map((s) => [String(s.userId), s]));
  const tagCounts = await QrTag.aggregate([{ $group: { _id: '$ownerId', count: { $sum: 1 } } }]);
  const tagCountByUser = new Map(tagCounts.map((t) => [String(t._id), t.count]));

  res.json(
    users.map((u) => ({
      ...u.toJSON(),
      subscription: subByUser.get(String(u._id))?.toJSON() ?? null,
      qrTagCount: tagCountByUser.get(String(u._id)) ?? 0,
    })),
  );
});

export const adminCreateCustomer = asyncHandler(async (req: Request, res: Response) => {
  const input = adminCreateCustomerSchema.parse(req.body);

  const existing = await User.findOne({ phone: input.phone });
  if (existing) throw new HttpError(409, 'A customer with this phone number already exists.');

  // name is set from the start (not "New User"), so when this customer later verifies OTP
  // with this phone, authController.verifyOtp finds the existing user and the frontend's OTP
  // page skips straight to /dashboard instead of /register — no separate signup step needed.
  const user = await User.create({
    name: input.name,
    phone: input.phone,
    email: input.email,
    role: 'vehicle_owner',
  });

  // Vehicle details are compulsory for admin-created customers (enforced by
  // adminCreateCustomerSchema), so the QR tag + vehicle record are always created together.
  const qrTag = await QrTag.create({ ownerId: user._id, type: 'vehicle', label: input.vehicleNumber });
  const vehicle = await Vehicle.create({
    userId: user._id,
    vehicleNumber: input.vehicleNumber,
    vehicleType: input.vehicleType,
    brand: input.brand,
    model: input.model,
    year: input.year,
    qrId: qrTag._id,
  });

  res.status(201).json({ user: user.toJSON(), vehicle: vehicle.toJSON(), qrTag: qrTag.toJSON() });
});

export const getCustomerDetail = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.params.userId);
  if (!user) throw new HttpError(404, 'Customer not found.');

  const [subscription, qrTags, vehicles, businesses] = await Promise.all([
    Subscription.findOne({ userId: user._id }),
    QrTag.find({ ownerId: user._id }).sort({ createdAt: -1 }),
    Vehicle.find({ userId: user._id }),
    Business.find({ userId: user._id }),
  ]);

  res.json({
    user: user.toJSON(),
    subscription: subscription?.toJSON() ?? null,
    qrTags: qrTags.map((t) => t.toJSON()),
    vehicles: vehicles.map((v) => v.toJSON()),
    businesses: businesses.map((b) => b.toJSON()),
  });
});

export const adminUpdateSubscription = asyncHandler(async (req: Request, res: Response) => {
  const { plan, durationDays } = upgradeSubscriptionSchema.parse(req.body);
  const user = await User.findById(req.params.userId);
  if (!user) throw new HttpError(404, 'Customer not found.');

  const startDate = new Date();
  const endDate = plan === 'free' ? undefined : addDays(startDate, durationDays ?? 30);

  const sub = await Subscription.findOneAndUpdate(
    { userId: user._id },
    { plan, startDate, endDate, paymentStatus: plan === 'free' ? 'na' : 'paid' },
    { new: true, upsert: true },
  );
  res.json(sub.toJSON());
});

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export const getAnalytics = asyncHandler(async (_req: Request, res: Response) => {
  const [scanAgg] = await QrTag.aggregate([{ $group: { _id: null, totalScans: { $sum: '$scanCount' } } }]);
  const totalCallClicks = await CallLog.countDocuments();

  const since30d = addDays(new Date(), -30);
  const dailyReport = await CallLog.aggregate([
    { $match: { createdAt: { $gte: since30d } } },
    { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, calls: { $sum: 1 } } },
    { $sort: { _id: 1 } },
    { $project: { _id: 0, date: '$_id', calls: 1 } },
  ]);

  const since12m = addDays(new Date(), -365);
  const monthlyReport = await CallLog.aggregate([
    { $match: { createdAt: { $gte: since12m } } },
    { $group: { _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } }, calls: { $sum: 1 } } },
    { $sort: { _id: 1 } },
    { $project: { _id: 0, month: '$_id', calls: 1 } },
  ]);

  const vehicleWise = await Vehicle.aggregate([
    {
      $lookup: {
        from: 'qrtags',
        localField: 'qrId',
        foreignField: '_id',
        as: 'tag',
      },
    },
    { $unwind: '$tag' },
    {
      $lookup: {
        from: 'calllogs',
        localField: 'qrId',
        foreignField: 'qrId',
        as: 'calls',
      },
    },
    {
      $project: {
        _id: 0,
        vehicleId: '$_id',
        vehicleNumber: 1,
        qrId: '$qrId',
        scanCount: '$tag.scanCount',
        callCount: { $size: '$calls' },
      },
    },
  ]);

  res.json({
    totalScans: scanAgg?.totalScans ?? 0,
    totalCallClicks,
    dailyReport,
    monthlyReport,
    vehicleWise,
  });
});
