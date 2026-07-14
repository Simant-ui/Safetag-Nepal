export type UserRole = 'normal' | 'vehicle_owner' | 'business' | 'admin';

export interface User {
  userId: string;
  name: string;
  phone: string;
  email?: string;
  profileImage?: string;
  role: UserRole;
  emergencyContact?: string;
  bloodGroup?: string;
  address?: string;
  createdAt: string;
}

export type VehicleType = 'car' | 'bike' | 'scooter' | 'truck' | 'other';

export interface Vehicle {
  vehicleId: string;
  userId: string;
  vehicleNumber: string;
  vehicleType: VehicleType;
  brand?: string;
  model?: string;
  color?: string;
  year?: number;
  image?: string;
  qrId: string;
}

export type QrTagType = 'vehicle' | 'emergency' | 'personal' | 'business';
export type QrTagStatus = 'active' | 'inactive';

export interface QrTag {
  qrId: string;
  ownerId: string;
  type: QrTagType;
  status: QrTagStatus;
  label?: string;
  scanCount: number;
  createdAt: string;
  lastScannedAt?: string;
}

export type ContactRequestType = 'call' | 'message' | 'emergency' | 'wrong_parking';
export type ContactRequestStatus = 'pending' | 'acknowledged' | 'closed';

export interface ContactRequest {
  requestId: string;
  qrId: string;
  callerInfo?: {
    name?: string;
    phone?: string;
  };
  message?: string;
  requestType: ContactRequestType;
  status: ContactRequestStatus;
  createdAt: string;
}

/**
 * What an anonymous scanner is allowed to see. No `phone`/`email` field exists on this
 * type at all, so the contact page can never accidentally render the owner's real number.
 */
export interface PublicOwnerView {
  qrId: string;
  tagType: QrTagType;
  status: QrTagStatus;
  nickname: string;
  maskedPhoneHint?: string;
  vehicleNumber?: string;
  vehicleTypeLabel?: string;
  bloodGroup?: string;
  emergencyNote?: string;
  businessName?: string;
  businessCategory?: string;
}

export type SubscriptionPlan = 'free' | 'premium' | 'business';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'na';

export interface Subscription {
  subscriptionId: string;
  userId: string;
  plan: SubscriptionPlan;
  startDate: string;
  endDate?: string;
  paymentStatus: PaymentStatus;
}

export type MessageKind = 'text' | 'voice';

export interface Conversation {
  conversationId: string;
  qrId: string;
  qrLabel: string;
  lastMessage?: string;
  lastMessageAt?: string;
  unreadCount: number;
}

export interface Message {
  messageId: string;
  conversationId: string;
  kind: MessageKind;
  body: string;
  fromOwner: boolean;
  createdAt: string;
  voiceUri?: string;
  voiceDurationSec?: number;
}

export type NotificationCategory =
  | 'contact_request'
  | 'emergency'
  | 'wrong_parking'
  | 'message'
  | 'system';

export interface NotificationItem {
  notificationId: string;
  category: NotificationCategory;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
  relatedQrId?: string;
  relatedConversationId?: string;
}

export interface BusinessProfile {
  businessId: string;
  userId: string;
  qrId: string;
  name: string;
  category: string;
  description?: string;
  phone?: string;
  website?: string;
  location?: string;
  socialLinks?: { platform: string; url: string }[];
  services?: string[];
}
