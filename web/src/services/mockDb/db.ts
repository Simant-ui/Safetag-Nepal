import { nanoid } from 'nanoid';
import type {
  BusinessProfile,
  ContactRequest,
  Conversation,
  Message,
  NotificationItem,
  QrTag,
  Subscription,
  User,
  Vehicle,
} from '@/types/models';
import type { ScanHistoryEntry } from '@/services/qr/qrTypes';
import { seedBusinesses, seedConversations, seedMessages, seedQrTags, seedSubscriptions, seedUsers, seedVehicles } from './seedData';

/** Simple in-memory store standing in for the future MongoDB-backed API. Resets on app reload. */
class MockDatabase {
  users: User[] = [...seedUsers];
  vehicles: Vehicle[] = [...seedVehicles];
  qrTags: QrTag[] = [...seedQrTags];
  contactRequests: ContactRequest[] = [];
  subscriptions: Subscription[] = [...seedSubscriptions];
  conversations: Conversation[] = [...seedConversations];
  messages: Message[] = [...seedMessages];
  notifications: NotificationItem[] = [];
  businesses: BusinessProfile[] = [...seedBusinesses];
  scanHistory: Record<string, ScanHistoryEntry[]> = {};

  currentUserId: string | null = null;

  genId(prefix: string): string {
    return `${prefix}_${nanoid(12)}`;
  }
}

export const mockDb = new MockDatabase();

/** Simulates network latency so loading states in the UI are realistic to build/test against. */
export const simulateLatency = (ms = 500): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));
