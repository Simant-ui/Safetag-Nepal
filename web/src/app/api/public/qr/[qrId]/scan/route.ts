import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/db';
import { QrTag } from '@/lib/models/QrTag';
import { handleRouteError, HttpError } from '@/lib/apiError';
import { assertOwnerSubscriptionActive } from '@/lib/subscriptionGuard';

export async function POST(_req: NextRequest, { params }: { params: { qrId: string } }) {
  try {
    await connectDB();
    const tag = await QrTag.findById(params.qrId);
    if (!tag) throw new HttpError(404, 'QR tag not found.');
    await assertOwnerSubscriptionActive(tag.ownerId);

    tag.scanCount += 1;
    tag.lastScannedAt = new Date();
    await tag.save();
    return new Response(null, { status: 204 });
  } catch (err) {
    return handleRouteError(err);
  }
}
