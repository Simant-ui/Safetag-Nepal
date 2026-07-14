import type { Types } from 'mongoose';
import { Subscription } from '../models/Subscription';
import { HttpError } from './asyncHandler';

/**
 * Blocks scanner-facing QR actions once the owner's paid plan has expired. Free-plan
 * subscriptions never have an endDate, so they're never affected by this check — only a
 * Premium/Business subscription whose endDate has passed blocks the tag.
 */
export async function assertOwnerSubscriptionActive(ownerId: Types.ObjectId | string): Promise<void> {
  const sub = await Subscription.findOne({ userId: ownerId });
  if (sub?.endDate && sub.endDate.getTime() < Date.now()) {
    throw new HttpError(403, "This QR tag is currently unavailable — the owner's subscription has expired.");
  }
}
