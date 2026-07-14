/**
 * localStorage-backed session token storage for this mock/demo phase.
 *
 * NOT a final security posture: localStorage is readable by any JS on the page, so it's
 * vulnerable to XSS token theft. Phase 2 (real backend) should issue the session as an
 * httpOnly, Secure, SameSite cookie set by the server instead, so client-side JS never
 * touches the token at all.
 */
const TOKEN_KEY = 'safetag.auth.token';
const USER_ID_KEY = 'safetag.auth.userId';

const isBrowser = () => typeof window !== 'undefined';

export const tokenStorage = {
  getToken(): string | null {
    if (!isBrowser()) return null;
    return window.localStorage.getItem(TOKEN_KEY);
  },
  setToken(token: string): void {
    if (!isBrowser()) return;
    window.localStorage.setItem(TOKEN_KEY, token);
  },
  clearToken(): void {
    if (!isBrowser()) return;
    window.localStorage.removeItem(TOKEN_KEY);
  },
  getUserId(): string | null {
    if (!isBrowser()) return null;
    return window.localStorage.getItem(USER_ID_KEY);
  },
  setUserId(userId: string): void {
    if (!isBrowser()) return;
    window.localStorage.setItem(USER_ID_KEY, userId);
  },
  clearUserId(): void {
    if (!isBrowser()) return;
    window.localStorage.removeItem(USER_ID_KEY);
  },
};
