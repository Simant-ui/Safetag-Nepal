import type { QrTagType } from '@/types/models';

export interface QrTagTypeMeta {
  value: QrTagType;
  label: string;
  description: string;
  icon: string;
}

export const QR_TAG_TYPES: QrTagTypeMeta[] = [
  {
    value: 'vehicle',
    label: 'Vehicle',
    description: 'Bike, car, scooter or truck — let people reach you without wrong-parking hassle.',
    icon: 'car',
  },
  {
    value: 'emergency',
    label: 'Emergency Profile',
    description: 'Medical info and emergency contact, visible instantly to first responders.',
    icon: 'medical-bag',
  },
  {
    value: 'personal',
    label: 'Personal Item',
    description: 'Bags, laptops, gadgets — help a finder return it safely.',
    icon: 'bag-personal',
  },
  {
    value: 'business',
    label: 'Business',
    description: 'Shops, restaurants and service providers — share your profile instantly.',
    icon: 'storefront',
  },
];

export const getQrTagTypeMeta = (type: QrTagType): QrTagTypeMeta =>
  QR_TAG_TYPES.find((t) => t.value === type) ?? QR_TAG_TYPES[0];
