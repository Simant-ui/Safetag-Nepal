import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/lib/models/User';
import { Subscription } from '@/lib/models/Subscription';
import { QrTag } from '@/lib/models/QrTag';
import { Vehicle } from '@/lib/models/Vehicle';
import { handleRouteError, HttpError, jsonError } from '@/lib/apiError';
import { requireAdmin } from '@/lib/auth';
import { adminCreateCustomerSchema } from '@/lib/zodSchemas';

export async function GET(req: NextRequest) {
  try {
    if (!requireAdmin(req)) return jsonError(401, 'Admin authentication required.');

    await connectDB();
    const users = await User.find().sort({ createdAt: -1 });
    const subs = await Subscription.find({ userId: { $in: users.map((u) => u._id) } });
    const subByUser = new Map(subs.map((s) => [String(s.userId), s]));
    const tagCounts = await QrTag.aggregate([{ $group: { _id: '$ownerId', count: { $sum: 1 } } }]);
    const tagCountByUser = new Map(tagCounts.map((t) => [String(t._id), t.count]));

    return NextResponse.json(
      users.map((u) => ({
        ...u.toJSON(),
        subscription: subByUser.get(String(u._id))?.toJSON() ?? null,
        qrTagCount: tagCountByUser.get(String(u._id)) ?? 0,
      })),
    );
  } catch (err) {
    return handleRouteError(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!requireAdmin(req)) return jsonError(401, 'Admin authentication required.');

    await connectDB();
    const input = adminCreateCustomerSchema.parse(await req.json());

    const existing = await User.findOne({ phone: input.phone });
    if (existing) throw new HttpError(409, 'A customer with this phone number already exists.');

    // name is set from the start (not "New User"), so when this customer later verifies OTP
    // with this phone, the auth route finds the existing user and the frontend's OTP page
    // skips straight to /dashboard instead of /register — no separate signup step needed.
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

    return NextResponse.json({ user: user.toJSON(), vehicle: vehicle.toJSON(), qrTag: qrTag.toJSON() }, { status: 201 });
  } catch (err) {
    return handleRouteError(err);
  }
}
