import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/lib/models/User';
import { handleRouteError, HttpError, jsonError } from '@/lib/apiError';
import { requireAuth } from '@/lib/auth';
import { updateProfileSchema } from '@/lib/zodSchemas';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = requireAuth(req);
    if (!auth || params.id !== auth.userId) return jsonError(403, 'Not authorized.');

    await connectDB();
    const user = await User.findById(params.id);
    if (!user) throw new HttpError(404, 'User not found.');
    return NextResponse.json(user.toJSON());
  } catch (err) {
    return handleRouteError(err);
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = requireAuth(req);
    if (!auth || params.id !== auth.userId) return jsonError(403, 'Not authorized.');

    await connectDB();
    const input = updateProfileSchema.parse(await req.json());
    const user = await User.findByIdAndUpdate(params.id, input, { new: true });
    if (!user) throw new HttpError(404, 'User not found.');
    return NextResponse.json(user.toJSON());
  } catch (err) {
    return handleRouteError(err);
  }
}
