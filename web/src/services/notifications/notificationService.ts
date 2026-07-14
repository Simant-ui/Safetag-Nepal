import type { NotificationItem } from '@/types/models';
import type { PushNotificationInput } from './notificationTypes';

export interface NotificationService {
  /** No-op until the FCM/backend phase — returns null for now. */
  registerForPush(): Promise<string | null>;
  /** Fires a browser notification (used to simulate the eventual push-driven UX). */
  fireLocal(input: PushNotificationInput): Promise<void>;
  onNotificationTap(handler: (data: Record<string, unknown> | undefined) => void): () => void;
  listAll(userId: string): Promise<NotificationItem[]>;
  markRead(notificationId: string): Promise<void>;
  /** Creates the notification record AND fires the browser notification for it. */
  notify(userId: string, input: PushNotificationInput): Promise<NotificationItem>;
}
