import type { QrTagType } from '@/types/models';

export interface CreateQrTagInput {
  type: QrTagType;
  label?: string;
}

export interface ScanHistoryEntry {
  scannedAt: string;
  approximateArea?: string;
}
