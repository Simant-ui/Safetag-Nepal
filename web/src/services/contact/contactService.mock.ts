import type { ContactRequest } from '@/types/models';
import { mockDb, simulateLatency } from '@/services/mockDb/db';
import { BrowserNotificationService } from '@/services/notifications/notificationService.browser';
import type { ContactService } from './contactService';
import type { CallBridgeResult, SendContactRequestInput } from './contactTypes';

// Mock-to-mock dependency only (state lives in the shared mockDb, so a second instance
// is harmless) — avoids a circular import through services/index.ts's factory.
const notificationService = new BrowserNotificationService();

const REQUEST_TYPE_COPY: Record<SendContactRequestInput['requestType'], { title: string; body: string }> = {
  call: { title: 'Missed call request', body: 'Someone tried to call you regarding your QR tag.' },
  message: { title: 'New message', body: 'Someone contacted you regarding your QR tag.' },
  emergency: { title: 'Emergency alert', body: 'Someone reported an emergency using your QR tag.' },
  wrong_parking: { title: 'Vehicle needs attention', body: 'Your vehicle may be blocking someone.' },
};

export class MockContactService implements ContactService {
  async sendContactRequest(input: SendContactRequestInput): Promise<ContactRequest> {
    await simulateLatency(120);
    const tag = mockDb.qrTags.find((t) => t.qrId === input.qrId);
    if (!tag) throw new Error('QR tag not found.');

    const request: ContactRequest = {
      requestId: mockDb.genId('creq'),
      qrId: input.qrId,
      callerInfo: input.callerInfo,
      message: input.message,
      requestType: input.requestType,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    mockDb.contactRequests.push(request);

    const copy = REQUEST_TYPE_COPY[input.requestType];
    await notificationService.notify(tag.ownerId, {
      category: input.requestType === 'wrong_parking' ? 'wrong_parking' : input.requestType === 'emergency' ? 'emergency' : 'contact_request',
      title: copy.title,
      body: copy.body,
      relatedQrId: input.qrId,
    });

    return request;
  }

  async initiateCallRequest(qrId: string): Promise<CallBridgeResult> {
    await simulateLatency(150);
    const tag = mockDb.qrTags.find((t) => t.qrId === qrId);
    if (!tag) throw new Error('QR tag not found.');

    await this.sendContactRequest({ qrId, requestType: 'call' });

    // Mock bridge id — Phase 2 replaces this with a real Twilio/Exotel call-forwarding session,
    // returning a virtual number the scanner's dialer actually calls.
    return { maskedCallId: mockDb.genId('call'), dialNumber: undefined };
  }

  async listRequestsForOwner(ownerId: string): Promise<ContactRequest[]> {
    await simulateLatency(100);
    const myQrIds = new Set(mockDb.qrTags.filter((t) => t.ownerId === ownerId).map((t) => t.qrId));
    return mockDb.contactRequests.filter((r) => myQrIds.has(r.qrId));
  }

  async acknowledgeRequest(requestId: string): Promise<ContactRequest> {
    await simulateLatency(80);
    const request = mockDb.contactRequests.find((r) => r.requestId === requestId);
    if (!request) throw new Error('Request not found.');
    request.status = 'acknowledged';
    return request;
  }
}
