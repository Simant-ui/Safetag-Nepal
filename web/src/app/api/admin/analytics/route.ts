import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { QrTag } from '@/lib/models/QrTag';
import { CallLog } from '@/lib/models/CallLog';
import { Vehicle } from '@/lib/models/Vehicle';
import { handleRouteError, jsonError } from '@/lib/apiError';
import { requireAdmin } from '@/lib/auth';
import { addDays } from '@/lib/dateUtils';

export async function GET(req: NextRequest) {
  try {
    if (!requireAdmin(req)) return jsonError(401, 'Admin authentication required.');

    await connectDB();
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
      { $lookup: { from: 'qrtags', localField: 'qrId', foreignField: '_id', as: 'tag' } },
      { $unwind: '$tag' },
      { $lookup: { from: 'calllogs', localField: 'qrId', foreignField: 'qrId', as: 'calls' } },
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

    return NextResponse.json({
      totalScans: scanAgg?.totalScans ?? 0,
      totalCallClicks,
      dailyReport,
      monthlyReport,
      vehicleWise,
    });
  } catch (err) {
    return handleRouteError(err);
  }
}
