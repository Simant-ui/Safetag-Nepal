import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { ContactRequest } from '@/lib/models/ContactRequest';
import { QrTag } from '@/lib/models/QrTag';
import { handleRouteError, HttpError } from '@/lib/apiError';
import { assertOwnerSubscriptionActive } from '@/lib/subscriptionGuard';
import { notifyOwner } from '@/lib/notify';
import { CONTACT_REQUEST_COPY } from '@/lib/contactCopy';
import { checkRateLimit } from '@/lib/rateLimit';
import { sendContactRequestSchema } from '@/lib/zodSchemas';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const input = sendContactRequestSchema.parse(await req.json());

    const ip = req.headers.get('x-forwarded-for') ?? 'unknown';
    if (!checkRateLimit(`contact:${ip}`, 20, 60 * 1000)) {
      return handleRouteError(new HttpError(429, 'Too many requests. Please slow down.'));
    }

    const tag = await QrTag.findById(input.qrId);
    if (!tag) throw new HttpError(404, 'QR tag not found.');
    await assertOwnerSubscriptionActive(tag.ownerId);

    const request = await ContactRequest.create(input);

    const copy = CONTACT_REQUEST_COPY[input.requestType];
    await notifyOwner({ userId: tag.ownerId, category: copy.category, title: copy.title, body: copy.body, relatedQrId: tag._id });

    return NextResponse.json(request.toJSON(), { status: 201 });
  } catch (err) {
    return handleRouteError(err);
  }
}
