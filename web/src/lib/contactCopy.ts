import type { NotificationCategory } from '@/types/models';

export const CONTACT_REQUEST_COPY: Record<string, { title: string; body: string; category: NotificationCategory }> = {
  call: { title: 'Missed call request', body: 'Someone tried to call you regarding your QR tag.', category: 'contact_request' },
  message: { title: 'New message', body: 'Someone contacted you regarding your QR tag.', category: 'contact_request' },
  emergency: { title: 'Emergency alert', body: 'Someone reported an emergency using your QR tag.', category: 'emergency' },
  wrong_parking: { title: 'Vehicle needs attention', body: 'Your vehicle may be blocking someone.', category: 'wrong_parking' },
};
