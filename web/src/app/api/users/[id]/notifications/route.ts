import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Notification } from '@/lib/models/Notification';
import { handleRouteError, jsonError } from '@/lib/apiError';
import { requireAuth } from '@/lib/auth';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = requireAuth(req);
    if (!auth || params.id !== auth.userId) return jsonError(403, 'Not authorized.');

    await connectDB();
    const items = await Notification.find({ userId: params.id }).sort({ createdAt: -1 });
    return NextResponse.json(items.map((n) => n.toJSON()));
  } catch (err) {
    return handleRouteError(err);
  }
}
