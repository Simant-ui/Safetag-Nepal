import { apiClient } from '@/services/api/client';
import type { BusinessProfile, QrTag } from '@/types/models';
import type { BusinessService } from './businessService';
import type { RegisterBusinessInput } from './businessTypes';

export class HttpBusinessService implements BusinessService {
  async getByUser(userId: string): Promise<BusinessProfile[]> {
    return apiClient.get<BusinessProfile[]>(`/users/${userId}/businesses`);
  }

  async register(
    userId: string,
    input: RegisterBusinessInput,
  ): Promise<{ business: BusinessProfile; qrTag: QrTag }> {
    return apiClient.post<{ business: BusinessProfile; qrTag: QrTag }>(`/users/${userId}/businesses`, input);
  }

  async update(businessId: string, input: Partial<RegisterBusinessInput>): Promise<BusinessProfile> {
    return apiClient.patch<BusinessProfile>(`/businesses/${businessId}`, input);
  }
}
