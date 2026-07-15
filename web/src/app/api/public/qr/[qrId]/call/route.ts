import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { ContactRequest } from '@/lib/models/ContactRequest';
import { QrTag } from '@/lib/models/QrTag';
import { handleRouteError, HttpError } from '@/lib/apiError';
import { assertOwnerSubscriptionActive } from '@/lib/subscriptionGuard';
import { notifyOwner } from '@/lib/notify';
import { CONTACT_REQUEST_COPY } from '@/lib/contactCopy';

export async function POST(_req: NextRequest, { params }: { params: { qrId: string } }) {
  try {
    await connectDB();
    const tag = await QrTag.findById(params.qrId);
    if (!tag) throw new HttpError(404, 'QR tag not found.');
    await assertOwnerSubscriptionActive(tag.ownerId);

    await ContactRequest.create({ qrId: tag._id, requestType: 'call' });
    const copy = CONTACT_REQUEST_COPY.call;
    await notifyOwner({ userId: tag.ownerId, category: copy.category, title: copy.title, body: copy.body, relatedQrId: tag._id });

    // Mock bridge id — Phase 3 replaces this with a real Twilio/Exotel call-forwarding session.
    return NextResponse.json({ maskedCallId: `call_${Date.now()}`, dialNumber: undefined });
  } catch (err) {
    return handleRouteError(err);
  }
}
