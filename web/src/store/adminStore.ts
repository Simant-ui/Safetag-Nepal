import { create } from 'zustand';
import { API_BASE_URL } from '@/constants/appConfig';
import { adminTokenStorage } from '@/services/storage/adminTokenStorage';

export interface AdminCustomer {
  userId: string;
  name: string;
  phone: string;
  email?: string;
  role: string;
  createdAt: string;
  qrTagCount: number;
  subscription: {
    subscriptionId: string;
    plan: 'free' | 'premium' | 'business';
    startDate: string;
    endDate?: string;
    paymentStatus: string;
  } | null;
}

export interface AdminQrTag {
  qrId: string;
  type: string;
  status: string;
  label?: string;
  scanCount: number;
  createdAt: string;
  lastScannedAt?: string;
}

export interface AdminCustomerDetail {
  user: AdminCustomer;
  subscription: AdminCustomer['subscription'];
  qrTags: AdminQrTag[];
  vehicles: { vehicleId: string; vehicleNumber: string; vehicleType: string; brand?: string; model?: string; year?: number }[];
  businesses: { businessId: string; name: string; category: string }[];
}

interface AdminState {
  token: string | null;
  status: 'idle' | 'loading' | 'authenticated' | 'unauthenticated';
  error: string | null;
  customers: AdminCustomer[];
  loadingCustomers: boolean;

  restoreSession: () => void;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  fetchCustomers: () => Promise<void>;
  updateCustomerPlan: (userId: string, plan: string, durationDays?: number) => Promise<void>;
  fetchCustomerDetail: (userId: string) => Promise<AdminCustomerDetail>;
  createCustomer: (input: {
    name: string;
    phone: string;
    email?: string;
    vehicleNumber?: string;
    vehicleType?: string;
    brand?: string;
    model?: string;
    year?: number;
  }) => Promise<void>;
}

async function adminFetch<T>(path: string, token: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.message ?? `Request failed with status ${res.status}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const useAdminStore = create<AdminState>((set, get) => ({
  token: null,
  status: 'idle',
  error: null,
  customers: [],
  loadingCustomers: false,

  restoreSession: () => {
    const token = adminTokenStorage.getToken();
    set({ token, status: token ? 'authenticated' : 'unauthenticated' });
  },

  login: async (username: string, password: string) => {
    set({ status: 'loading', error: null });
    try {
      const res = await fetch(`${API_BASE_URL}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.message ?? 'Login failed.');
      }
      const { token } = (await res.json()) as { token: string };
      adminTokenStorage.setToken(token);
      set({ token, status: 'authenticated' });
    } catch (e) {
      set({ status: 'unauthenticated', error: (e as Error).message });
      throw e;
    }
  },

  logout: () => {
    adminTokenStorage.clearToken();
    set({ token: null, status: 'unauthenticated', customers: [] });
  },

  fetchCustomers: async () => {
    const token = get().token;
    if (!token) return;
    set({ loadingCustomers: true });
    try {
      const customers = await adminFetch<AdminCustomer[]>('/admin/customers', token);
      set({ customers, loadingCustomers: false });
    } catch (e) {
      set({ loadingCustomers: false, error: (e as Error).message });
    }
  },

  updateCustomerPlan: async (userId: string, plan: string, durationDays?: number) => {
    const token = get().token;
    if (!token) return;
    await adminFetch(`/admin/customers/${userId}/subscription`, token, {
      method: 'PATCH',
      body: JSON.stringify({ plan, durationDays }),
    });
    await get().fetchCustomers();
  },

  fetchCustomerDetail: async (userId: string) => {
    const token = get().token;
    if (!token) throw new Error('Not authenticated.');
    return adminFetch<AdminCustomerDetail>(`/admin/customers/${userId}`, token);
  },

  createCustomer: async (input) => {
    const token = get().token;
    if (!token) return;
    await adminFetch('/admin/customers', token, { method: 'POST', body: JSON.stringify(input) });
    await get().fetchCustomers();
  },
}));
