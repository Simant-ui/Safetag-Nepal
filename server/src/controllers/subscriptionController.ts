import type { Request, Response } from 'express';
import { Subscription } from '../models/Subscription';
import { asyncHandler, HttpError } from '../utils/asyncHandler';

// Note: qrTagLimit is rendered as its own line by the frontend (e.g. "1 QR tag" /
// "Unlimited QR tags") — don't repeat that as a features entry too.
const PLANS = [
  { plan: 'free', priceLabel: 'Free', qrTagLimit: 1, features: ['Basic profile'] },
  {
    plan: 'premium',
    priceLabel: 'Rs. 499/month',
    qrTagLimit: 'unlimited',
    features: ['Call masking', 'Emergency features', 'Scan analytics'],
  },
  {
    plan: 'business',
    priceLabel: 'Rs. 1,999/month',
    qrTagLimit: 'unlimited',
    features: ['Multiple vehicles', 'Team members', 'Business dashboard', 'Everything in Premium'],
  },
];

export const listPlans = asyncHandler(async (_req: Request, res: Response) => {
  res.json(PLANS);
});

export const getCurrentSubscription = asyncHandler(async (req: Request, res: Response) => {
  if (req.params.id !== req.userId) throw new HttpError(403, 'Not authorized.');
  let sub = await Subscription.findOne({ userId: req.params.id });
  if (!sub) sub = await Subscription.create({ userId: req.params.id, plan: 'free' });
  res.json(sub.toJSON());
});

export const upgradeSubscription = asyncHandler(async (_req: Request, _res: Response) => {
  // Customer self-upgrade is intentionally disabled — only the admin panel
  // (adminController.adminUpdateSubscription) may change a customer's plan.
  throw new HttpError(403, 'Only an administrator can change your subscription plan. Please contact support.');
});
