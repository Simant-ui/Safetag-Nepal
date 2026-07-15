import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/lib/models/User';
import { Subscription } from '@/lib/models/Subscription';
import { QrTag } from '@/lib/models/QrTag';
import { Vehicle } from '@/lib/models/Vehicle';
import { Business } from '@/lib/models/Business';
import { handleRouteError, HttpError, jsonError } from '@/lib/apiError';
import { requireAdmin } from '@/lib/auth';

export async function GET(req: NextRequest, { params }: { params: { userId: string } }) {
  try {
    if (!requireAdmin(req)) return jsonError(401, 'Admin authentication required.');

    await connectDB();
    const user = await User.findById(params.userId);
    if (!user) throw new HttpError(404, 'Customer not found.');

    const [subscription, qrTags, vehicles, businesses] = await Promise.all([
      Subscription.findOne({ userId: user._id }),
      QrTag.find({ ownerId: user._id }).sort({ createdAt: -1 }),
      Vehicle.find({ userId: user._id }),
      Business.find({ userId: user._id }),
    ]);

    return NextResponse.json({
      user: user.toJSON(),
      subscription: subscription?.toJSON() ?? null,
      qrTags: qrTags.map((t) => t.toJSON()),
      vehicles: vehicles.map((v) => v.toJSON()),
      businesses: businesses.map((b) => b.toJSON()),
    });
  } catch (err) {
    return handleRouteError(err);
  }
}
