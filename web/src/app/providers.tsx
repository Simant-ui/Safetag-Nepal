'use client';

import * as React from 'react';
import { ThemeRegistry } from '@/theme/ThemeRegistry';
import { useAuthStore } from '@/store/authStore';

function SessionBootstrap() {
  const restoreSession = useAuthStore((s) => s.restoreSession);

  React.useEffect(() => {
    restoreSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeRegistry>
      <SessionBootstrap />
      {children}
    </ThemeRegistry>
  );
}
