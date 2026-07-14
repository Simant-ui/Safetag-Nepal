import type { User } from '@/types/models';

export type OtpIntent = 'login' | 'signup';

export interface OtpSendResult {
  requestId: string;
  devCode?: string;
}

export interface AuthSession {
  user: User;
  token: string;
}

export interface RegisterProfileInput {
  name: string;
  email?: string;
  bloodGroup?: string;
  emergencyContact?: string;
  address?: string;
}
