import { create } from 'zustand';
import { localPrefs, PREF_KEYS } from '@/services/storage/localPrefs';

type ThemeMode = 'light' | 'dark' | 'system';

interface UiState {
  themeMode: ThemeMode;
  hasSeenOnboarding: boolean;
  setThemeMode: (mode: ThemeMode) => void;
  loadPrefs: () => void;
  markOnboardingSeen: () => void;
}

export const useUiStore = create<UiState>((set) => ({
  themeMode: 'system',
  hasSeenOnboarding: false,

  setThemeMode: (mode) => {
    localPrefs.setItem(PREF_KEYS.themeMode, mode);
    set({ themeMode: mode });
  },

  loadPrefs: () => {
    const mode = localPrefs.getItem(PREF_KEYS.themeMode) as ThemeMode | null;
    const seen = localPrefs.getItem(PREF_KEYS.hasSeenOnboarding);
    set({
      themeMode: mode ?? 'system',
      hasSeenOnboarding: seen === 'true',
    });
  },

  markOnboardingSeen: () => {
    localPrefs.setItem(PREF_KEYS.hasSeenOnboarding, 'true');
    set({ hasSeenOnboarding: true });
  },
}));
