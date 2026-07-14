import type { ContactRequest } from '@/types/models';
import type { CallBridgeResult, SendContactRequestInput } from './contactTypes';

export interface ContactService {
  sendContactRequest(input: SendContactRequestInput): Promise<ContactRequest>;
  /**
   * Initiates a masked call session. Architected for a future virtual-number/call-forwarding
   * provider (Twilio, Exotel, or a Nepali telecom API) — the caller never learns the owner's
   * real number, and the owner never learns the caller's, on either end of the bridge.
   */
  initiateCallRequest(qrId: string): Promise<CallBridgeResult>;
  listRequestsForOwner(ownerId: string): Promise<ContactRequest[]>;
  acknowledgeRequest(requestId: string): Promise<ContactRequest>;
}
