import type { PublicOwnerView, QrTag, QrTagStatus } from '@/types/models';
import type { CreateQrTagInput, ScanHistoryEntry } from './qrTypes';

export interface QrService {
  listMyTags(userId: string): Promise<QrTag[]>;
  createTag(userId: string, input: CreateQrTagInput): Promise<QrTag>;
  getTagPublic(qrId: string): Promise<PublicOwnerView>;
  setStatus(qrId: string, status: QrTagStatus): Promise<QrTag>;
  recordScan(qrId: string): Promise<void>;
  getScanHistory(qrId: string): Promise<ScanHistoryEntry[]>;
  deleteTag(qrId: string): Promise<void>;
}
