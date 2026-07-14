import type { Request, Response } from 'express';
import { env } from '../config/env';
import { User } from '../models/User';
import { OtpRequest } from '../models/OtpRequest';
import { asyncHandler, HttpError } from '../utils/asyncHandler';
import { signToken } from '../utils/jwt';
import { generateOtpCode } from '../utils/otp';
import { completeProfileSchema, sendOtpSchema, verifyOtpSchema } from '../utils/zodSchemas';

export const sendOtp = asyncHandler(async (req: Request, res: Response) => {
  const { phone, intent } = sendOtpSchema.parse(req.body);

  const existing = await User.findOne({ phone });
  // "New User" means an account row exists but the profile form was never completed — that
  // still counts as "not registered yet" for login purposes, so an abandoned signup doesn't
  // permanently lock someone out of the Sign Up tab.
  const isRegistered = !!existing && existing.name !== 'New User';

  if (intent === 'login' && !isRegistered) {
    throw new HttpError(404, 'This number is not registered. Please sign up first.');
  }
  if (intent === 'signup' && isRegistered) {
    throw new HttpError(409, 'This number is already registered. Please log in instead.');
  }

  const code = generateOtpCode(phone);
  const otpRequest = await OtpRequest.create({ phone, code });

  res.json({
    requestId: String(otpRequest._id),
    // Dev-visible only — real SMS delivery is a Phase 3 integration (see utils/otp.ts).
    devCode: env.isProduction ? undefined : code,
  });
});

export const verifyOtp = asyncHandler(async (req: Request, res: Response) => {
  const { requestId, code } = verifyOtpSchema.parse(req.body);

  const otpRequest = await OtpRequest.findById(requestId);
  if (!otpRequest || otpRequest.used) {
    throw new HttpError(400, 'This OTP request has expired. Please request a new code.');
  }
  if (otpRequest.code !== code) {
    throw new HttpError(400, 'Incorrect code. Please try again.');
  }
  otpRequest.used = true;
  await otpRequest.save();

  let user = await User.findOne({ phone: otpRequest.phone });
  if (!user) {
    user = await User.create({ phone: otpRequest.phone, name: 'New User', role: 'normal' });
  }

  const token = signToken({ userId: String(user._id) });
  res.json({ user: user.toJSON(), token });
});

export const completeProfile = asyncHandler(async (req: Request, res: Response) => {
  if (req.params.id !== req.userId) throw new HttpError(403, 'Not authorized.');

  const input = completeProfileSchema.parse(req.body);
  const user = await User.findByIdAndUpdate(req.params.id, input, { new: true });
  if (!user) throw new HttpError(404, 'User not found.');

  const token = signToken({ userId: String(user._id) });
  res.json({ user: user.toJSON(), token });
});

export const getSession = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.userId);
  if (!user) throw new HttpError(404, 'Session user not found.');
  res.json({ user: user.toJSON(), token: signToken({ userId: String(user._id) }) });
});

export const logout = asyncHandler(async (_req: Request, res: Response) => {
  // Stateless JWT — nothing to invalidate server-side in this phase.
  res.status(204).end();
});

export const loginWithGoogle = asyncHandler(async (_req: Request, res: Response) => {
  throw new HttpError(501, 'Google login requires a configured OAuth client — not set up yet.');
});
