import type { Request, Response } from 'express';
import { Notification } from '../models/Notification';
import { asyncHandler, HttpError } from '../utils/asyncHandler';

export const listNotifications = asyncHandler(async (req: Request, res: Response) => {
  if (req.params.id !== req.userId) throw new HttpError(403, 'Not authorized.');
  const items = await Notification.find({ userId: req.params.id }).sort({ createdAt: -1 });
  res.json(items.map((n) => n.toJSON()));
});

export const markNotificationRead = asyncHandler(async (req: Request, res: Response) => {
  const notification = await Notification.findById(req.params.id);
  if (!notification) throw new HttpError(404, 'Notification not found.');
  if (String(notification.userId) !== req.userId) throw new HttpError(403, 'Not authorized.');
  notification.read = true;
  await notification.save();
  res.status(204).end();
});
