import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/db';
import { QrTag } from '@/lib/models/QrTag';
import { User } from '@/lib/models/User';
import { CallLog } from '@/lib/models/CallLog';
import { ContactRequest } from '@/lib/models/ContactRequest';
import { handleRouteError, HttpError } from '@/lib/apiError';
import { assertOwnerSubscriptionActive } from '@/lib/subscriptionGuard';
import { notifyOwner } from '@/lib/notify';
import { CONTACT_REQUEST_COPY } from '@/lib/contactCopy';
import { callProvider } from '@/lib/callProvider';
import { parseUserAgent } from '@/lib/parseUserAgent';

/**
 * GET /api/public/qr/:qrId/call/dial — a plain top-level browser navigation (not fetch/XHR), so
 * we can respond with a 302 redirect straight to a tel: URI. The phone number never appears in
 * rendered page text or in a JSON response body the frontend could log or display; it only ever
 * exists in this server-side redirect Location header, resolved via callProvider so a real
 * masking/telecom integration can replace DirectDialCallProvider without touching this route.
 *
 * Uses the raw Response constructor (not NextResponse.redirect) since tel: is a non-http(s)
 * scheme that NextResponse.redirect's URL validation may not accept reliably.
 */
export async function GET(req: NextRequest, { params }: { params: { qrId: string } }) {
  try {
    await connectDB();
    const tag = await QrTag.findById(params.qrId);
    if (!tag) throw new HttpError(404, 'This QR tag does not exist or has been removed.');
    if (tag.status === 'inactive') throw new HttpError(403, 'This QR tag is currently deactivated by its owner.');
    await assertOwnerSubscriptionActive(tag.ownerId);

    const owner = await User.findById(tag.ownerId);
    if (!owner) throw new HttpError(404, 'Owner not found.');

    const userAgent = req.headers.get('user-agent') ?? undefined;
    const { browserName, deviceType } = parseUserAgent(userAgent);
    await CallLog.create({
      qrId: tag._id,
      visitorIp: req.headers.get('x-forwarded-for') ?? undefined,
      userAgent,
      browserName,
      deviceType,
    });

    tag.scanCount += 1;
    tag.lastScannedAt = new Date();
    await tag.save();

    const copy = CONTACT_REQUEST_COPY.call;
    await ContactRequest.create({ qrId: tag._id, requestType: 'call' });
    await notifyOwner({ userId: tag.ownerId, category: copy.category, title: copy.title, body: copy.body, relatedQrId: tag._id });

    const { redirectUrl } = await callProvider.initiateCall(owner.phone, {
      qrId: String(tag._id),
      visitorIp: req.headers.get('x-forwarded-for') ?? undefined,
    });

    return new Response(null, { status: 302, headers: { Location: redirectUrl } });
  } catch (err) {
    return handleRouteError(err);
  }
}
