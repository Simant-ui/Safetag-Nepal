'use client';

import * as React from 'react';
import createCache from '@emotion/cache';
import { useServerInsertedHTML } from 'next/navigation';
import { CacheProvider } from '@emotion/react';
import { CssBaseline, ThemeProvider as MuiThemeProvider } from '@mui/material';
import { lightTheme, darkTheme } from './muiTheme';
import { useUiStore } from '@/store/uiStore';

// Standard Next.js App Router + Emotion SSR registry (avoids FOUC / hydration mismatch).
function useEmotionCache() {
  const [{ cache, flush }] = React.useState(() => {
    const cache = createCache({ key: 'mui' });
    cache.compat = true;
    const prevInsert = cache.insert;
    let inserted: string[] = [];
    cache.insert = (...args) => {
      const serialized = args[1];
      if (cache.inserted[serialized.name] === undefined) {
        inserted.push(serialized.name);
      }
      return prevInsert(...args);
    };
    const flush = () => {
      const prevInserted = inserted;
      inserted = [];
      return prevInserted;
    };
    return { cache, flush };
  });

  useServerInsertedHTML(() => {
    const names = flush();
    if (names.length === 0) return null;
    let styles = '';
    for (const name of names) {
      styles += cache.inserted[name];
    }
    return (
      <style
        key={cache.key}
        data-emotion={`${cache.key} ${names.join(' ')}`}
        dangerouslySetInnerHTML={{ __html: styles }}
      />
    );
  });

  return cache;
}

export function ThemeRegistry({ children }: { children: React.ReactNode }) {
  const cache = useEmotionCache();
  const themeMode = useUiStore((s) => s.themeMode);
  const loadPrefs = useUiStore((s) => s.loadPrefs);
  const [systemPrefersDark, setSystemPrefersDark] = React.useState(false);

  React.useEffect(() => {
    loadPrefs();
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    setSystemPrefersDark(mq.matches);
    const handler = (e: MediaQueryListEvent) => setSystemPrefersDark(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isDark = themeMode === 'dark' || (themeMode === 'system' && systemPrefersDark);
  const theme = isDark ? darkTheme : lightTheme;

  return (
    <CacheProvider value={cache}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </CacheProvider>
  );
}
