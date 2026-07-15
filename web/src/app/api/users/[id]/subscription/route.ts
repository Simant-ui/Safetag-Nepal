import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Subscription } from '@/lib/models/Subscription';
import { handleRouteError, jsonError } from '@/lib/apiError';
import { requireAuth } from '@/lib/auth';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = requireAuth(req);
    if (!auth || params.id !== auth.userId) return jsonError(403, 'Not authorized.');

    await connectDB();
    let sub = await Subscription.findOne({ userId: params.id });
    if (!sub) sub = await Subscription.create({ userId: params.id, plan: 'free' });
    return NextResponse.json(sub.toJSON());
  } catch (err) {
    return handleRouteError(err);
  }
}
