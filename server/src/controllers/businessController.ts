import type { Request, Response } from 'express';
import { Business } from '../models/Business';
import { QrTag } from '../models/QrTag';
import { asyncHandler, HttpError } from '../utils/asyncHandler';
import { registerBusinessSchema } from '../utils/zodSchemas';

export const getByUser = asyncHandler(async (req: Request, res: Response) => {
  if (req.params.id !== req.userId) throw new HttpError(403, 'Not authorized.');
  const businesses = await Business.find({ userId: req.params.id }).sort({ createdAt: -1 });
  res.json(businesses.map((b) => b.toJSON()));
});

export const registerBusiness = asyncHandler(async (req: Request, res: Response) => {
  if (req.params.id !== req.userId) throw new HttpError(403, 'Not authorized.');
  const input = registerBusinessSchema.parse(req.body);

  const qrTag = await QrTag.create({ ownerId: req.params.id, type: 'business', label: input.name });
  const business = await Business.create({ userId: req.params.id, qrId: qrTag._id, ...input });

  res.status(201).json({ business: business.toJSON(), qrTag: qrTag.toJSON() });
});

export const updateBusiness = asyncHandler(async (req: Request, res: Response) => {
  const input = registerBusinessSchema.partial().parse(req.body);
  const business = await Business.findById(req.params.id);
  if (!business) throw new HttpError(404, 'Business not found.');
  if (String(business.userId) !== req.userId) throw new HttpError(403, 'Not authorized.');
  Object.assign(business, input);
  await business.save();
  res.json(business.toJSON());
});
