import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { QrTag } from '@/lib/models/QrTag';
import { handleRouteError, HttpError, jsonError } from '@/lib/apiError';
import { requireAuth } from '@/lib/auth';
import { setQrStatusSchema } from '@/lib/zodSchemas';

export async function PATCH(req: NextRequest, { params }: { params: { qrId: string } }) {
  try {
    const auth = requireAuth(req);
    if (!auth) return jsonError(401, 'Authentication required.');

    await connectDB();
    const { status } = setQrStatusSchema.parse(await req.json());

    const tag = await QrTag.findById(params.qrId);
    if (!tag) throw new HttpError(404, 'QR tag not found.');
    if (String(tag.ownerId) !== auth.userId) throw new HttpError(403, 'Not authorized.');

    tag.status = status;
    await tag.save();
    return NextResponse.json(tag.toJSON());
  } catch (err) {
    return handleRouteError(err);
  }
}
