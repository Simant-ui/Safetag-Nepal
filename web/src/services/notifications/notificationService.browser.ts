import { mockDb, simulateLatency } from '@/services/mockDb/db';
import type { NotificationItem } from '@/types/models';
import type { NotificationService } from './notificationService';
import type { PushNotificationInput } from './notificationTypes';

type TapHandler = (data: Record<string, unknown> | undefined) => void;
const tapHandlers = new Set<TapHandler>();

const isBrowser = () => typeof window !== 'undefined' && typeof Notification !== 'undefined';

export class BrowserNotificationService implements NotificationService {
  async registerForPush(): Promise<string | null> {
    // TODO(FCM): request a Firebase Web Push token and register the device with the backend
    // once a Firebase project + backend endpoint exist. Deliberately a no-op for now.
    return null;
  }

  async fireLocal(input: PushNotificationInput): Promise<void> {
    if (!isBrowser()) return;

    if (Notification.permission === 'default') {
      await Notification.requestPermission();
    }
    if (Notification.permission !== 'granted') return;

    const data = {
      category: input.category,
      relatedQrId: input.relatedQrId,
      relatedConversationId: input.relatedConversationId,
    };
    const notification = new Notification(input.title, { body: input.body, data });
    notification.onclick = () => {
      tapHandlers.forEach((handler) => handler(data));
      window.focus();
    };
  }

  onNotificationTap(handler: TapHandler): () => void {
    tapHandlers.add(handler);
    return () => tapHandlers.delete(handler);
  }

  async listAll(_userId: string): Promise<NotificationItem[]> {
    await simulateLatency(300);
    // Single-tenant mock DB — every notification belongs to the current demo user.
    return [...mockDb.notifications].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  }

  async markRead(notificationId: string): Promise<void> {
    const item = mockDb.notifications.find((n) => n.notificationId === notificationId);
    if (item) item.read = true;
  }

  async notify(userId: string, input: PushNotificationInput): Promise<NotificationItem> {
    const item: NotificationItem = {
      notificationId: mockDb.genId(`notif_${userId}`),
      category: input.category,
      title: input.title,
      body: input.body,
      read: false,
      createdAt: new Date().toISOString(),
      relatedQrId: input.relatedQrId,
      relatedConversationId: input.relatedConversationId,
    };
    mockDb.notifications.unshift(item);
    await this.fireLocal(input);
    return item;
  }
}
