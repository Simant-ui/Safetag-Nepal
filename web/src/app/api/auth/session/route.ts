import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/lib/models/User';
import { handleRouteError, HttpError, jsonError } from '@/lib/apiError';
import { requireAuth, signToken } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const auth = requireAuth(req);
    if (!auth) return jsonError(401, 'Authentication required.');

    await connectDB();
    const user = await User.findById(auth.userId);
    if (!user) throw new HttpError(404, 'Session user not found.');

    return NextResponse.json({ user: user.toJSON(), token: signToken({ userId: String(user._id) }) });
  } catch (err) {
    return handleRouteError(err);
  }
}
