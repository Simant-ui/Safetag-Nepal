import type { Request, Response } from 'express';
import { QrTag } from '../models/QrTag';
import { asyncHandler, HttpError } from '../utils/asyncHandler';
import { buildPublicOwnerView } from '../utils/publicOwnerView';
import { assertOwnerSubscriptionActive } from '../utils/subscriptionGuard';
import { createQrTagSchema, setQrStatusSchema } from '../utils/zodSchemas';

export const listMyTags = asyncHandler(async (req: Request, res: Response) => {
  if (req.params.id !== req.userId) throw new HttpError(403, 'Not authorized.');
  const tags = await QrTag.find({ ownerId: req.params.id }).sort({ createdAt: -1 });
  res.json(tags.map((t) => t.toJSON()));
});

export const createTag = asyncHandler(async (req: Request, res: Response) => {
  if (req.params.id !== req.userId) throw new HttpError(403, 'Not authorized.');
  const input = createQrTagSchema.parse(req.body);
  const tag = await QrTag.create({ ownerId: req.params.id, type: input.type, label: input.label });
  res.status(201).json(tag.toJSON());
});

export const getTagPublic = asyncHandler(async (req: Request, res: Response) => {
  const view = await buildPublicOwnerView(req.params.qrId);
  res.json(view);
});

async function requireOwnedTag(qrId: string, userId: string | undefined) {
  const tag = await QrTag.findById(qrId);
  if (!tag) throw new HttpError(404, 'QR tag not found.');
  if (String(tag.ownerId) !== userId) throw new HttpError(403, 'Not authorized.');
  return tag;
}

export const setStatus = asyncHandler(async (req: Request, res: Response) => {
  const { status } = setQrStatusSchema.parse(req.body);
  const tag = await requireOwnedTag(req.params.qrId, req.userId);
  tag.status = status;
  await tag.save();
  res.json(tag.toJSON());
});

export const recordScan = asyncHandler(async (req: Request, res: Response) => {
  const tag = await QrTag.findById(req.params.qrId);
  if (!tag) throw new HttpError(404, 'QR tag not found.');
  await assertOwnerSubscriptionActive(tag.ownerId);

  tag.scanCount += 1;
  tag.lastScannedAt = new Date();
  await tag.save();
  res.status(204).end();
});

export const getScanHistory = asyncHandler(async (req: Request, res: Response) => {
  const tag = await requireOwnedTag(req.params.qrId, req.userId);
  // Detailed per-scan history isn't persisted separately in this phase — only the aggregate
  // scanCount/lastScannedAt are, matching what the mock exposed. Extend with a ScanEvent
  // collection later if per-scan timestamps/geolocation are needed.
  res.json(tag.lastScannedAt ? [{ scannedAt: tag.lastScannedAt.toISOString() }] : []);
});

export const deleteTag = asyncHandler(async (req: Request, res: Response) => {
  const tag = await requireOwnedTag(req.params.qrId, req.userId);
  await tag.deleteOne();
  res.status(204).end();
});
