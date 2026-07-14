import { tokenStorage } from '@/services/storage/tokenStorage';
import { apiConfig } from './config';

/**
 * Thin fetch wrapper for the real backend (Phase 2). Not used while apiConfig.useMock is true —
 * each domain's `.http.ts` implementation will call through this once the server exists.
 */
async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = tokenStorage.getToken();
  const res = await fetch(`${apiConfig.baseUrl}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.message ?? `Request failed with status ${res.status}`);
  }

  // 204 No Content (and any other empty-body response) has nothing to parse — calling
  // res.json() on it throws "Unexpected end of JSON input".
  if (res.status === 204) return undefined as T;
  const text = await res.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

export const apiClient = {
  get: <T>(path: string) => request<T>(path, { method: 'GET' }),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'POST', body: body ? JSON.stringify(body) : undefined }),
  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'PATCH', body: body ? JSON.stringify(body) : undefined }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
};

export const notImplemented = (name: string) => (): never => {
  throw new Error(
    `${name} is not implemented yet — the real backend integration lands in Phase 2. ` +
      'Set NEXT_PUBLIC_USE_MOCK_API=true to keep using the mock service layer.',
  );
};
