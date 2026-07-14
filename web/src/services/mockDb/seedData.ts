import type {
  BusinessProfile,
  Conversation,
  Message,
  QrTag,
  Subscription,
  User,
  Vehicle,
} from '@/types/models';

export const DEMO_USER_ID = 'user_demo001';

export const seedUsers: User[] = [
  {
    userId: DEMO_USER_ID,
    name: 'Sujata Shrestha',
    phone: '9841234567',
    email: 'sujata@example.com',
    role: 'vehicle_owner',
    emergencyContact: '9807654321',
    bloodGroup: 'B+',
    address: 'Baneshwor, Kathmandu',
    createdAt: '2026-01-10T09:00:00.000Z',
  },
];

export const seedVehicles: Vehicle[] = [
  {
    vehicleId: 'veh_001',
    userId: DEMO_USER_ID,
    vehicleNumber: 'BA 2 PA 3421',
    vehicleType: 'car',
    brand: 'Hyundai',
    model: 'Creta',
    color: 'White',
    year: 2022,
    qrId: 'qr_vehicle001',
  },
];

export const seedQrTags: QrTag[] = [
  {
    qrId: 'qr_vehicle001',
    ownerId: DEMO_USER_ID,
    type: 'vehicle',
    status: 'active',
    label: 'My Creta',
    scanCount: 4,
    createdAt: '2026-01-12T10:00:00.000Z',
  },
  {
    qrId: 'qr_emergency001',
    ownerId: DEMO_USER_ID,
    type: 'emergency',
    status: 'active',
    label: 'My Emergency Profile',
    scanCount: 0,
    createdAt: '2026-01-12T10:05:00.000Z',
  },
];

export const seedSubscriptions: Subscription[] = [
  {
    subscriptionId: 'sub_001',
    userId: DEMO_USER_ID,
    plan: 'free',
    startDate: '2026-01-10T09:00:00.000Z',
    paymentStatus: 'na',
  },
];

export const seedConversations: Conversation[] = [
  {
    conversationId: 'conv_001',
    qrId: 'qr_vehicle001',
    qrLabel: 'My Creta',
    lastMessage: 'Your vehicle is blocking the gate, please move it.',
    lastMessageAt: '2026-01-13T08:30:00.000Z',
    unreadCount: 1,
  },
];

export const seedMessages: Message[] = [
  {
    messageId: 'msg_001',
    conversationId: 'conv_001',
    kind: 'text',
    body: 'Your vehicle is blocking the gate, please move it.',
    fromOwner: false,
    createdAt: '2026-01-13T08:30:00.000Z',
  },
];

export const seedBusinesses: BusinessProfile[] = [];
