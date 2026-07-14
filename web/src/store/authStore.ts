import { create } from 'zustand';
import type { User } from '@/types/models';
import { authService } from '@/services';
import type { OtpIntent, RegisterProfileInput } from '@/services/auth/authTypes';
import { tokenStorage } from '@/services/storage/tokenStorage';

type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated';

interface AuthState {
  user: User | null;
  token: string | null;
  status: AuthStatus;
  pendingOtpRequestId: string | null;
  devOtpCode: string | null;
  error: string | null;

  restoreSession: () => Promise<void>;
  sendOtp: (phone: string, intent?: OtpIntent) => Promise<void>;
  verifyOtp: (code: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  completeProfile: (input: RegisterProfileInput) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  status: 'idle',
  pendingOtpRequestId: null,
  devOtpCode: null,
  error: null,

  restoreSession: async () => {
    set({ status: 'loading' });
    const token = tokenStorage.getToken();
    if (!token) {
      set({ status: 'unauthenticated' });
      return;
    }
    try {
      const session = await authService.restoreSession(token);
      if (!session) {
        tokenStorage.clearToken();
        set({ status: 'unauthenticated' });
        return;
      }
      set({ user: session.user, token: session.token, status: 'authenticated' });
    } catch {
      tokenStorage.clearToken();
      set({ status: 'unauthenticated' });
    }
  },

  sendOtp: async (phone: string, intent?: OtpIntent) => {
    set({ status: 'loading', error: null });
    try {
      const result = await authService.sendOtp(phone, intent);
      set({ pendingOtpRequestId: result.requestId, devOtpCode: result.devCode ?? null, status: 'unauthenticated' });
    } catch (e) {
      set({ status: 'unauthenticated', error: (e as Error).message });
      throw e;
    }
  },

  verifyOtp: async (code: string) => {
    const requestId = get().pendingOtpRequestId;
    if (!requestId) throw new Error('Please request a new code first.');
    set({ status: 'loading', error: null });
    try {
      const session = await authService.verifyOtp(requestId, code);
      tokenStorage.setToken(session.token);
      tokenStorage.setUserId(session.user.userId);
      set({ user: session.user, token: session.token, status: 'authenticated', pendingOtpRequestId: null });
    } catch (e) {
      set({ status: 'unauthenticated', error: (e as Error).message });
      throw e;
    }
  },

  loginWithGoogle: async () => {
    set({ status: 'loading', error: null });
    try {
      const session = await authService.loginWithGoogle('mock-id-token');
      tokenStorage.setToken(session.token);
      tokenStorage.setUserId(session.user.userId);
      set({ user: session.user, token: session.token, status: 'authenticated' });
    } catch (e) {
      set({ status: 'unauthenticated', error: (e as Error).message });
      throw e;
    }
  },

  completeProfile: async (input: RegisterProfileInput) => {
    const user = get().user;
    if (!user) throw new Error('Not signed in.');
    const session = await authService.completeProfile(user.userId, input);
    set({ user: session.user });
  },

  logout: async () => {
    await authService.logout();
    tokenStorage.clearToken();
    tokenStorage.clearUserId();
    set({ user: null, token: null, status: 'unauthenticated' });
  },

  clearError: () => set({ error: null }),
}));
