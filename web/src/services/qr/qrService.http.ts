import { apiClient } from '@/services/api/client';
import type { PublicOwnerView, QrTag, QrTagStatus } from '@/types/models';
import type { QrService } from './qrService';
import type { CreateQrTagInput, ScanHistoryEntry } from './qrTypes';

export class HttpQrService implements QrService {
  async listMyTags(userId: string): Promise<QrTag[]> {
    return apiClient.get<QrTag[]>(`/users/${userId}/qr-tags`);
  }

  async createTag(userId: string, input: CreateQrTagInput): Promise<QrTag> {
    return apiClient.post<QrTag>(`/users/${userId}/qr-tags`, input);
  }

  async getTagPublic(qrId: string): Promise<PublicOwnerView> {
    // Public, unauthenticated endpoint — the backend must never include phone/email in this response.
    return apiClient.get<PublicOwnerView>(`/public/qr/${qrId}`);
  }

  async setStatus(qrId: string, status: QrTagStatus): Promise<QrTag> {
    return apiClient.patch<QrTag>(`/qr-tags/${qrId}/status`, { status });
  }

  async recordScan(qrId: string): Promise<void> {
    await apiClient.post(`/public/qr/${qrId}/scan`);
  }

  async getScanHistory(qrId: string): Promise<ScanHistoryEntry[]> {
    return apiClient.get<ScanHistoryEntry[]>(`/qr-tags/${qrId}/scan-history`);
  }

  async deleteTag(qrId: string): Promise<void> {
    await apiClient.delete(`/qr-tags/${qrId}`);
  }
}
