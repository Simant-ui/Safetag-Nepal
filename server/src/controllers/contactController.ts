import type { Request, Response } from 'express';
import { ContactRequest } from '../models/ContactRequest';
import { QrTag } from '../models/QrTag';
import { User } from '../models/User';
import { CallLog } from '../models/CallLog';
import { asyncHandler, HttpError } from '../utils/asyncHandler';
import { notifyOwner } from '../utils/notify';
import { callProvider } from '../utils/callProvider';
import { parseUserAgent } from '../utils/parseUserAgent';
import { assertOwnerSubscriptionActive } from '../utils/subscriptionGuard';
import { sendContactRequestSchema } from '../utils/zodSchemas';

const COPY: Record<string, { title: string; body: string; category: 'contact_request' | 'emergency' | 'wrong_parking' }> = {
  call: { title: 'Missed call request', body: 'Someone tried to call you regarding your QR tag.', category: 'contact_request' },
  message: { title: 'New message', body: 'Someone contacted you regarding your QR tag.', category: 'contact_request' },
  emergency: { title: 'Emergency alert', body: 'Someone reported an emergency using your QR tag.', category: 'emergency' },
  wrong_parking: { title: 'Vehicle needs attention', body: 'Your vehicle may be blocking someone.', category: 'wrong_parking' },
};

export const sendContactRequest = asyncHandler(async (req: Request, res: Response) => {
  const input = sendContactRequestSchema.parse(req.body);
  const tag = await QrTag.findById(input.qrId);
  if (!tag) throw new HttpError(404, 'QR tag not found.');
  await assertOwnerSubscriptionActive(tag.ownerId);

  const request = await ContactRequest.create(input);

  const copy = COPY[input.requestType];
  await notifyOwner({ userId: tag.ownerId, category: copy.category, title: copy.title, body: copy.body, relatedQrId: tag._id });

  res.status(201).json(request.toJSON());
});

export const initiateCallRequest = asyncHandler(async (req: Request, res: Response) => {
  const tag = await QrTag.findById(req.params.qrId);
  if (!tag) throw new HttpError(404, 'QR tag not found.');
  await assertOwnerSubscriptionActive(tag.ownerId);

  await ContactRequest.create({ qrId: tag._id, requestType: 'call' });
  const copy = COPY.call;
  await notifyOwner({ userId: tag.ownerId, category: copy.category, title: copy.title, body: copy.body, relatedQrId: tag._id });

  // Mock bridge id — Phase 3 replaces this with a real Twilio/Exotel call-forwarding session.
  res.json({ maskedCallId: `call_${Date.now()}`, dialNumber: undefined });
});

/**
 * GET /public/qr/:qrId/call/dial — a plain top-level browser navigation (not fetch/XHR), so the
 * server can respond with a 302 redirect straight to a tel: URI. The phone number never appears
 * in rendered page text or in a JSON response body the frontend could log or display; it only
 * ever exists in this server-side redirect Location header, resolved via callProvider so a real
 * masking/telecom integration can replace DirectDialCallProvider without touching this route.
 */
export const dialCall = asyncHandler(async (req: Request, res: Response) => {
  const tag = await QrTag.findById(req.params.qrId);
  if (!tag) throw new HttpError(404, 'This QR tag does not exist or has been removed.');
  if (tag.status === 'inactive') throw new HttpError(403, 'This QR tag is currently deactivated by its owner.');
  await assertOwnerSubscriptionActive(tag.ownerId);

  const owner = await User.findById(tag.ownerId);
  if (!owner) throw new HttpError(404, 'Owner not found.');

  const { browserName, deviceType } = parseUserAgent(req.headers['user-agent']);
  await CallLog.create({
    qrId: tag._id,
    visitorIp: req.ip,
    userAgent: req.headers['user-agent'],
    browserName,
    deviceType,
  });

  tag.scanCount += 1;
  tag.lastScannedAt = new Date();
  await tag.save();

  const copy = COPY.call;
  await ContactRequest.create({ qrId: tag._id, requestType: 'call' });
  await notifyOwner({ userId: tag.ownerId, category: copy.category, title: copy.title, body: copy.body, relatedQrId: tag._id });

  const { redirectUrl } = await callProvider.initiateCall(owner.phone, { qrId: String(tag._id), visitorIp: req.ip });
  res.redirect(302, redirectUrl);
});

export const listRequestsForOwner = asyncHandler(async (req: Request, res: Response) => {
  if (req.params.id !== req.userId) throw new HttpError(403, 'Not authorized.');
  const myTagIds = (await QrTag.find({ ownerId: req.params.id }).select('_id')).map((t) => t._id);
  const requests = await ContactRequest.find({ qrId: { $in: myTagIds } }).sort({ createdAt: -1 });
  res.json(requests.map((r) => r.toJSON()));
});

export const acknowledgeRequest = asyncHandler(async (req: Request, res: Response) => {
  const request = await ContactRequest.findById(req.params.id);
  if (!request) throw new HttpError(404, 'Request not found.');
  const tag = await QrTag.findById(request.qrId);
  if (!tag || String(tag.ownerId) !== req.userId) throw new HttpError(403, 'Not authorized.');
  request.status = 'acknowledged';
  await request.save();
  res.json(request.toJSON());
});
