import type { BusinessProfile, QrTag } from '@/types/models';
import { mockDb, simulateLatency } from '@/services/mockDb/db';
import type { BusinessService } from './businessService';
import type { RegisterBusinessInput } from './businessTypes';

export class MockBusinessService implements BusinessService {
  async getByUser(userId: string): Promise<BusinessProfile[]> {
    await simulateLatency(100);
    return mockDb.businesses.filter((b) => b.userId === userId);
  }

  async register(
    userId: string,
    input: RegisterBusinessInput,
  ): Promise<{ business: BusinessProfile; qrTag: QrTag }> {
    await simulateLatency(150);

    const qrTag: QrTag = {
      qrId: mockDb.genId('qr'),
      ownerId: userId,
      type: 'business',
      status: 'active',
      label: input.name,
      scanCount: 0,
      createdAt: new Date().toISOString(),
    };
    mockDb.qrTags.push(qrTag);

    const business: BusinessProfile = {
      businessId: mockDb.genId('biz'),
      userId,
      qrId: qrTag.qrId,
      name: input.name,
      category: input.category,
      description: input.description,
      phone: input.phone,
      website: input.website,
      location: input.location,
      socialLinks: input.socialLinks,
      services: input.services,
    };
    mockDb.businesses.push(business);

    return { business, qrTag };
  }

  async update(businessId: string, input: Partial<RegisterBusinessInput>): Promise<BusinessProfile> {
    await simulateLatency(100);
    const business = mockDb.businesses.find((b) => b.businessId === businessId);
    if (!business) throw new Error('Business profile not found.');
    Object.assign(business, input);
    return business;
  }
}
