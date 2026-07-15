import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { ContactRequest } from '@/lib/models/ContactRequest';
import { QrTag } from '@/lib/models/QrTag';
import { handleRouteError, HttpError, jsonError } from '@/lib/apiError';
import { requireAuth } from '@/lib/auth';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = requireAuth(req);
    if (!auth) return jsonError(401, 'Authentication required.');

    await connectDB();
    const request = await ContactRequest.findById(params.id);
    if (!request) throw new HttpError(404, 'Request not found.');
    const tag = await QrTag.findById(request.qrId);
    if (!tag || String(tag.ownerId) !== auth.userId) throw new HttpError(403, 'Not authorized.');

    request.status = 'acknowledged';
    await request.save();
    return NextResponse.json(request.toJSON());
  } catch (err) {
    return handleRouteError(err);
  }
}
