import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/db';
import { Notification } from '@/lib/models/Notification';
import { handleRouteError, HttpError, jsonError } from '@/lib/apiError';
import { requireAuth } from '@/lib/auth';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = requireAuth(req);
    if (!auth) return jsonError(401, 'Authentication required.');

    await connectDB();
    const notification = await Notification.findById(params.id);
    if (!notification) throw new HttpError(404, 'Notification not found.');
    if (String(notification.userId) !== auth.userId) throw new HttpError(403, 'Not authorized.');

    notification.read = true;
    await notification.save();
    return new Response(null, { status: 204 });
  } catch (err) {
    return handleRouteError(err);
  }
}
