const ADMIN_TOKEN_KEY = 'safetag.admin.token';
const isBrowser = () => typeof window !== 'undefined';

/** Separate storage key from the customer session token — admin and customer sessions never mix. */
export const adminTokenStorage = {
  getToken(): string | null {
    if (!isBrowser()) return null;
    return window.localStorage.getItem(ADMIN_TOKEN_KEY);
  },
  setToken(token: string): void {
    if (!isBrowser()) return;
    window.localStorage.setItem(ADMIN_TOKEN_KEY, token);
  },
  clearToken(): void {
    if (!isBrowser()) return;
    window.localStorage.removeItem(ADMIN_TOKEN_KEY);
  },
};
