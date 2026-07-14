import type { User } from '@/types/models';
import { mockDb, simulateLatency } from '@/services/mockDb/db';
import { normalizePhoneInput } from '@/utils/validators';
import type { AuthService } from './authService';
import type { AuthSession, OtpIntent, OtpSendResult, RegisterProfileInput } from './authTypes';

interface PendingOtp {
  phone: string;
  code: string;
  createdAt: number;
}

const pendingOtps = new Map<string, PendingOtp>();

function encodeToken(userId: string): string {
  const payload = { userId, iat: Date.now() };
  const json = JSON.stringify(payload);
  const base64 = typeof btoa === 'function' ? btoa(json) : Buffer.from(json).toString('base64');
  return `mock.${base64}.sig`;
}

function decodeToken(token: string): { userId: string } | null {
  const parts = token.split('.');
  if (parts.length !== 3 || parts[0] !== 'mock') return null;
  try {
    const json = typeof atob === 'function' ? atob(parts[1]) : Buffer.from(parts[1], 'base64').toString('utf-8');
    const payload = JSON.parse(json) as { userId: string };
    return payload;
  } catch {
    return null;
  }
}

function findOrCreateUserByPhone(phone: string): User {
  const existing = mockDb.users.find((u) => u.phone === phone);
  if (existing) return existing;

  const user: User = {
    userId: mockDb.genId('user'),
    name: 'New User',
    phone,
    role: 'normal',
    createdAt: new Date().toISOString(),
  };
  mockDb.users.push(user);
  return user;
}

export class MockAuthService implements AuthService {
  async sendOtp(phone: string, intent?: OtpIntent): Promise<OtpSendResult> {
    await simulateLatency(150);
    const digits = normalizePhoneInput(phone);

    const existing = mockDb.users.find((u) => u.phone === digits);
    const isRegistered = !!existing && existing.name !== 'New User';
    if (intent === 'login' && !isRegistered) {
      throw new Error('This number is not registered. Please sign up first.');
    }
    if (intent === 'signup' && isRegistered) {
      throw new Error('This number is already registered. Please log in instead.');
    }

    const requestId = mockDb.genId('otpreq');
    // Dev-only: code is the phone's last 4 digits so testing doesn't require a real SMS provider
    // (Phase 3 will use a real OTP gateway). Matches the real backend's utils/otp.ts behavior.
    const code = digits.slice(-4);
    pendingOtps.set(requestId, { phone: digits, code, createdAt: Date.now() });
    return { requestId, devCode: code };
  }

  async verifyOtp(requestId: string, code: string): Promise<AuthSession> {
    await simulateLatency(150);
    const pending = pendingOtps.get(requestId);
    if (!pending) throw new Error('This OTP request has expired. Please request a new code.');
    if (pending.code !== code) throw new Error('Incorrect code. Please try again.');

    pendingOtps.delete(requestId);
    const user = findOrCreateUserByPhone(pending.phone);
    mockDb.currentUserId = user.userId;
    return { user, token: encodeToken(user.userId) };
  }

  async loginWithGoogle(_idToken: string): Promise<AuthSession> {
    await simulateLatency(150);
    // Mock only — real Google OAuth token exchange happens against the backend in Phase 2.
    const user = findOrCreateUserByPhone('9800000000');
    mockDb.currentUserId = user.userId;
    return { user, token: encodeToken(user.userId) };
  }

  async completeProfile(userId: string, input: RegisterProfileInput): Promise<AuthSession> {
    await simulateLatency(100);
    const user = mockDb.users.find((u) => u.userId === userId);
    if (!user) throw new Error('User not found.');
    Object.assign(user, input);
    return { user, token: encodeToken(user.userId) };
  }

  async restoreSession(token: string): Promise<AuthSession | null> {
    await simulateLatency(80);
    const decoded = decodeToken(token);
    if (!decoded) return null;
    const user = mockDb.users.find((u) => u.userId === decoded.userId);
    if (!user) return null;
    mockDb.currentUserId = user.userId;
    return { user, token };
  }

  async logout(): Promise<void> {
    await simulateLatency(60);
    mockDb.currentUserId = null;
  }
}
