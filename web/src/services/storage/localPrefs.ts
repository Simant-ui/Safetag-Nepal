/** Non-sensitive local preferences — never tokens or PII. */
const isBrowser = () => typeof window !== 'undefined';

export const localPrefs = {
  getItem(key: string): string | null {
    if (!isBrowser()) return null;
    return window.localStorage.getItem(key);
  },
  setItem(key: string, value: string): void {
    if (!isBrowser()) return;
    window.localStorage.setItem(key, value);
  },
  removeItem(key: string): void {
    if (!isBrowser()) return;
    window.localStorage.removeItem(key);
  },
};

export const PREF_KEYS = {
  hasSeenOnboarding: 'safetag.local.hasSeenOnboarding',
  themeMode: 'safetag.local.themeMode',
} as const;
