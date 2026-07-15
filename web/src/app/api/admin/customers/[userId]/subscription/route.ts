import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/lib/models/User';
import { Subscription } from '@/lib/models/Subscription';
import { handleRouteError, HttpError, jsonError } from '@/lib/apiError';
import { requireAdmin } from '@/lib/auth';
import { addDays } from '@/lib/dateUtils';
import { upgradeSubscriptionSchema } from '@/lib/zodSchemas';

export async function PATCH(req: NextRequest, { params }: { params: { userId: string } }) {
  try {
    if (!requireAdmin(req)) return jsonError(401, 'Admin authentication required.');

    await connectDB();
    const { plan, durationDays } = upgradeSubscriptionSchema.parse(await req.json());
    const user = await User.findById(params.userId);
    if (!user) throw new HttpError(404, 'Customer not found.');

    const startDate = new Date();
    const endDate = plan === 'free' ? undefined : addDays(startDate, durationDays ?? 30);

    const sub = await Subscription.findOneAndUpdate(
      { userId: user._id },
      { plan, startDate, endDate, paymentStatus: plan === 'free' ? 'na' : 'paid' },
      { new: true, upsert: true },
    );
    return NextResponse.json(sub.toJSON());
  } catch (err) {
    return handleRouteError(err);
  }
}
