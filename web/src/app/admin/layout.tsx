'use client';

import * as React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { useAdminStore } from '@/store/adminStore';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const status = useAdminStore((s) => s.status);
  const restoreSession = useAdminStore((s) => s.restoreSession);
  const logout = useAdminStore((s) => s.logout);

  React.useEffect(() => {
    restoreSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isLoginPage = pathname === '/admin/login';

  React.useEffect(() => {
    if (!isLoginPage && status === 'unauthenticated') router.replace('/admin/login');
  }, [isLoginPage, status, router]);

  if (isLoginPage) return <>{children}</>;

  if (status !== 'authenticated') {
    return (
      <Box sx={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100dvh', bgcolor: 'background.default' }}>
      <AppBar position="sticky" color="inherit" elevation={0} sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h3" sx={{ fontSize: 18, fontWeight: 700 }}>
            SafeTag <Box component="span" sx={{ color: 'primary.main' }}>Admin</Box>
          </Typography>
          <Button
            size="small"
            onClick={() => {
              logout();
              router.replace('/admin/login');
            }}
          >
            Log out
          </Button>
        </Toolbar>
        <Tabs
          value={pathname === '/admin/analytics' ? '/admin/analytics' : '/admin'}
          onChange={(_e, v) => router.push(v)}
          sx={{ px: 2 }}
        >
          <Tab label="Customers" value="/admin" />
          <Tab label="Analytics" value="/admin/analytics" />
        </Tabs>
      </AppBar>
      <Box sx={{ maxWidth: 1100, mx: 'auto', p: { xs: 2, sm: 3 } }}>{children}</Box>
    </Box>
  );
}
