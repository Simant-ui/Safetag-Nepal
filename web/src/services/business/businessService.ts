import type { BusinessProfile, QrTag } from '@/types/models';
import type { RegisterBusinessInput } from './businessTypes';

export interface BusinessService {
  getByUser(userId: string): Promise<BusinessProfile[]>;
  register(userId: string, input: RegisterBusinessInput): Promise<{ business: BusinessProfile; qrTag: QrTag }>;
  update(businessId: string, input: Partial<RegisterBusinessInput>): Promise<BusinessProfile>;
}
