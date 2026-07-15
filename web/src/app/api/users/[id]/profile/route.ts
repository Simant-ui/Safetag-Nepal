import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/lib/models/User';
import { handleRouteError, HttpError, jsonError } from '@/lib/apiError';
import { requireAuth, signToken } from '@/lib/auth';
import { completeProfileSchema } from '@/lib/zodSchemas';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = requireAuth(req);
    if (!auth || params.id !== auth.userId) return jsonError(403, 'Not authorized.');

    await connectDB();
    const input = completeProfileSchema.parse(await req.json());
    const user = await User.findByIdAndUpdate(params.id, input, { new: true });
    if (!user) throw new HttpError(404, 'User not found.');

    const token = signToken({ userId: String(user._id) });
    return NextResponse.json({ user: user.toJSON(), token });
  } catch (err) {
    return handleRouteError(err);
  }
}
