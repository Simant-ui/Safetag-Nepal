import { create } from 'zustand';
import type { QrTag, QrTagStatus } from '@/types/models';
import { qrService } from '@/services';
import type { CreateQrTagInput } from '@/services/qr/qrTypes';

interface QrState {
  tags: QrTag[];
  loading: boolean;
  error: string | null;

  fetchTags: (userId: string) => Promise<void>;
  createTag: (userId: string, input: CreateQrTagInput) => Promise<QrTag>;
  addTag: (tag: QrTag) => void;
  setStatus: (qrId: string, status: QrTagStatus) => Promise<void>;
  deleteTag: (qrId: string) => Promise<void>;
}

export const useQrStore = create<QrState>((set, get) => ({
  tags: [],
  loading: false,
  error: null,

  fetchTags: async (userId: string) => {
    set({ loading: true, error: null });
    try {
      const tags = await qrService.listMyTags(userId);
      set({ tags, loading: false });
    } catch (e) {
      set({ loading: false, error: (e as Error).message });
    }
  },

  createTag: async (userId: string, input: CreateQrTagInput) => {
    const tag = await qrService.createTag(userId, input);
    set({ tags: [tag, ...get().tags] });
    return tag;
  },

  addTag: (tag: QrTag) => set({ tags: [tag, ...get().tags] }),

  setStatus: async (qrId: string, status: QrTagStatus) => {
    const updated = await qrService.setStatus(qrId, status);
    set({ tags: get().tags.map((t) => (t.qrId === qrId ? updated : t)) });
  },

  deleteTag: async (qrId: string) => {
    await qrService.deleteTag(qrId);
    set({ tags: get().tags.filter((t) => t.qrId !== qrId) });
  },
}));
