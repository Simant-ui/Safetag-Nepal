import { apiClient, notImplemented } from '@/services/api/client';
import type { NotificationItem } from '@/types/models';
import type { NotificationService } from './notificationService';

/**
 * Phase 2 implementation. Once a Firebase project + backend exist:
 *  - registerForPush() requests a Firebase Web Push (VAPID) token and POSTs it to the backend
 *    (e.g. POST /users/:id/push-tokens) so the server can send real pushes via a service worker.
 *  - notify()/fireLocal() become server-driven: the backend sends the FCM push when a
 *    ContactRequest is created, and this class only needs to read the resulting notification
 *    list from the API — it should NOT also fire a local notification for remote pushes.
 */
export class FcmNotificationService implements NotificationService {
  registerForPush = notImplemented('FcmNotificationService.registerForPush');
  fireLocal = notImplemented('FcmNotificationService.fireLocal');

  onNotificationTap(_handler: (data: Record<string, unknown> | undefined) => void): () => void {
    return () => {};
  }

  async listAll(userId: string): Promise<NotificationItem[]> {
    return apiClient.get<NotificationItem[]>(`/users/${userId}/notifications`);
  }

  async markRead(notificationId: string): Promise<void> {
    await apiClient.patch(`/notifications/${notificationId}/read`);
  }

  notify = notImplemented('FcmNotificationService.notify');
}
