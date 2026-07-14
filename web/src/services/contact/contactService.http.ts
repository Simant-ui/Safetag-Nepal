import { apiClient } from '@/services/api/client';
import type { ContactRequest } from '@/types/models';
import type { ContactService } from './contactService';
import type { CallBridgeResult, SendContactRequestInput } from './contactTypes';

export class HttpContactService implements ContactService {
  async sendContactRequest(input: SendContactRequestInput): Promise<ContactRequest> {
    return apiClient.post<ContactRequest>('/public/contact-requests', input);
  }

  async initiateCallRequest(qrId: string): Promise<CallBridgeResult> {
    // Phase 2: backend brokers a Twilio/Exotel call-forwarding session here.
    return apiClient.post<CallBridgeResult>(`/public/qr/${qrId}/call`);
  }

  async listRequestsForOwner(ownerId: string): Promise<ContactRequest[]> {
    return apiClient.get<ContactRequest[]>(`/users/${ownerId}/contact-requests`);
  }

  async acknowledgeRequest(requestId: string): Promise<ContactRequest> {
    return apiClient.patch<ContactRequest>(`/contact-requests/${requestId}/acknowledge`);
  }
}
