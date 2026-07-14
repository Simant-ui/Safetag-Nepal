import type { AuthSession, OtpIntent, OtpSendResult, RegisterProfileInput } from './authTypes';

export interface AuthService {
  sendOtp(phone: string, intent?: OtpIntent): Promise<OtpSendResult>;
  verifyOtp(requestId: string, code: string): Promise<AuthSession>;
  loginWithGoogle(idToken: string): Promise<AuthSession>;
  completeProfile(userId: string, input: RegisterProfileInput): Promise<AuthSession>;
  restoreSession(token: string): Promise<AuthSession | null>;
  logout(): Promise<void>;
}
