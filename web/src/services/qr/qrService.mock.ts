import type { PublicOwnerView, QrTag, QrTagStatus } from '@/types/models';
import { mockDb, simulateLatency } from '@/services/mockDb/db';
import { getQrTagTypeMeta } from '@/constants/qrTagTypes';
import type { QrService } from './qrService';
import type { CreateQrTagInput, ScanHistoryEntry } from './qrTypes';

function buildPublicOwnerView(tag: QrTag): PublicOwnerView {
  const owner = mockDb.users.find((u) => u.userId === tag.ownerId);
  const nickname = tag.label || owner?.name.split(' ')[0] || 'SafeTag User';

  const base: PublicOwnerView = {
    qrId: tag.qrId,
    tagType: tag.type,
    status: tag.status,
    nickname,
  };

  if (tag.type === 'vehicle') {
    const vehicle = mockDb.vehicles.find((v) => v.qrId === tag.qrId);
    return {
      ...base,
      vehicleNumber: vehicle?.vehicleNumber,
      vehicleTypeLabel: vehicle ? getQrTagTypeMeta('vehicle').label : undefined,
    };
  }

  if (tag.type === 'emergency') {
    return {
      ...base,
      bloodGroup: owner?.bloodGroup,
      emergencyNote: owner?.address ? `Lives near ${owner.address}` : undefined,
    };
  }

  if (tag.type === 'business') {
    const business = mockDb.businesses.find((b) => b.qrId === tag.qrId);
    return {
      ...base,
      businessName: business?.name,
      businessCategory: business?.category,
    };
  }

  return base;
}

export class MockQrService implements QrService {
  async listMyTags(userId: string): Promise<QrTag[]> {
    await simulateLatency(100);
    return mockDb.qrTags.filter((t) => t.ownerId === userId);
  }

  async createTag(userId: string, input: CreateQrTagInput): Promise<QrTag> {
    await simulateLatency(120);
    const tag: QrTag = {
      qrId: mockDb.genId('qr'),
      ownerId: userId,
      type: input.type,
      status: 'active',
      label: input.label,
      scanCount: 0,
      createdAt: new Date().toISOString(),
    };
    mockDb.qrTags.push(tag);
    return tag;
  }

  async getTagPublic(qrId: string): Promise<PublicOwnerView> {
    await simulateLatency(100);
    const tag = mockDb.qrTags.find((t) => t.qrId === qrId);
    if (!tag) throw new Error('This QR tag does not exist or has been removed.');
    if (tag.status === 'inactive') {
      throw new Error('This QR tag is currently deactivated by its owner.');
    }
    return buildPublicOwnerView(tag);
  }

  async setStatus(qrId: string, status: QrTagStatus): Promise<QrTag> {
    await simulateLatency(80);
    const tag = mockDb.qrTags.find((t) => t.qrId === qrId);
    if (!tag) throw new Error('QR tag not found.');
    tag.status = status;
    return tag;
  }

  async recordScan(qrId: string): Promise<void> {
    await simulateLatency(60);
    const tag = mockDb.qrTags.find((t) => t.qrId === qrId);
    if (!tag) return;
    tag.scanCount += 1;
    tag.lastScannedAt = new Date().toISOString();
    const entry: ScanHistoryEntry = { scannedAt: tag.lastScannedAt };
    mockDb.scanHistory[qrId] = [entry, ...(mockDb.scanHistory[qrId] ?? [])];
  }

  async getScanHistory(qrId: string): Promise<ScanHistoryEntry[]> {
    await simulateLatency(80);
    return mockDb.scanHistory[qrId] ?? [];
  }

  async deleteTag(qrId: string): Promise<void> {
    await simulateLatency(80);
    mockDb.qrTags = mockDb.qrTags.filter((t) => t.qrId !== qrId);
  }
}
