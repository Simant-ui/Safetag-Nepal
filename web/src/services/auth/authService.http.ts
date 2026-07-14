import { apiClient, notImplemented } from '@/services/api/client';
import type { AuthService } from './authService';
import type { AuthSession, OtpIntent, OtpSendResult, RegisterProfileInput } from './authTypes';

/** Real backend implementation (Phase 2) — wires to POST /auth/otp/send, /auth/otp/verify, etc. */
export class HttpAuthService implements AuthService {
  async sendOtp(phone: string, intent?: OtpIntent): Promise<OtpSendResult> {
    return apiClient.post<OtpSendResult>('/auth/otp/send', { phone, intent });
  }

  async verifyOtp(requestId: string, code: string): Promise<AuthSession> {
    return apiClient.post<AuthSession>('/auth/otp/verify', { requestId, code });
  }

  loginWithGoogle = notImplemented('HttpAuthService.loginWithGoogle');

  async completeProfile(userId: string, input: RegisterProfileInput): Promise<AuthSession> {
    return apiClient.patch<AuthSession>(`/users/${userId}/profile`, input);
  }

  async restoreSession(_token: string): Promise<AuthSession | null> {
    return apiClient.get<AuthSession | null>('/auth/session').catch(() => null);
  }

  async logout(): Promise<void> {
    await apiClient.post('/auth/logout');
  }
}
