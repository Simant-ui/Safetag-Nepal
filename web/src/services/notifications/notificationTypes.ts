import type { NotificationCategory } from '@/types/models';

export interface PushNotificationInput {
  category: NotificationCategory;
  title: string;
  body: string;
  relatedQrId?: string;
  relatedConversationId?: string;
}
