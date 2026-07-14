import { Types } from 'mongoose';
import { Notification, type NotificationCategory } from '../models/Notification';

interface NotifyInput {
  userId: Types.ObjectId | string;
  category: NotificationCategory;
  title: string;
  body: string;
  relatedQrId?: Types.ObjectId | string;
  relatedConversationId?: Types.ObjectId | string;
}

// Push delivery (FCM/web push) is a Phase 3 integration — for now this just persists the
// notification record; clients fetch it on page load/focus (no live-push in the mock either).
export async function notifyOwner(input: NotifyInput): Promise<void> {
  await Notification.create(input);
}
