import { create } from 'zustand';
import type { NotificationItem } from '@/types/models';
import { notificationService } from '@/services';

interface NotificationState {
  items: NotificationItem[];
  loading: boolean;

  fetchAll: (userId: string) => Promise<void>;
  markRead: (notificationId: string) => Promise<void>;
  unreadCount: () => number;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  items: [],
  loading: false,

  fetchAll: async (userId: string) => {
    set({ loading: true });
    const items = await notificationService.listAll(userId);
    set({ items, loading: false });
  },

  markRead: async (notificationId: string) => {
    await notificationService.markRead(notificationId);
    set({
      items: get().items.map((n) => (n.notificationId === notificationId ? { ...n, read: true } : n)),
    });
  },

  unreadCount: () => get().items.filter((n) => !n.read).length,
}));
