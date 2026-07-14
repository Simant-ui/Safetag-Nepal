import type { Request, Response } from 'express';
import { env } from '../config/env';
import { User } from '../models/User';
import { asyncHandler, HttpError } from '../utils/asyncHandler';
import { updateProfileSchema } from '../utils/zodSchemas';

export const getUserById = asyncHandler(async (req: Request, res: Response) => {
  if (req.params.id !== req.userId) throw new HttpError(403, 'Not authorized.');
  const user = await User.findById(req.params.id);
  if (!user) throw new HttpError(404, 'User not found.');
  res.json(user.toJSON());
});

export const updateProfile = asyncHandler(async (req: Request, res: Response) => {
  if (req.params.id !== req.userId) throw new HttpError(403, 'Not authorized.');
  const input = updateProfileSchema.parse(req.body);
  const user = await User.findByIdAndUpdate(req.params.id, input, { new: true });
  if (!user) throw new HttpError(404, 'User not found.');
  res.json(user.toJSON());
});

export const uploadProfileImage = asyncHandler(async (req: Request, res: Response) => {
  if (req.params.id !== req.userId) throw new HttpError(403, 'Not authorized.');
  const { localUri } = req.body as { localUri?: string };
  if (!localUri) throw new HttpError(400, 'localUri is required.');

  // No Cloudinary account configured yet — echo the input back so the endpoint stays
  // functional; once env.cloudinaryUrl is set this branch uploads for real, no client change.
  if (!env.cloudinaryUrl) {
    res.json({ url: localUri });
    return;
  }

  throw new HttpError(501, 'Cloudinary upload not yet implemented — set CLOUDINARY_URL and add the SDK call here.');
});
