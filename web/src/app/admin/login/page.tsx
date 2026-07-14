'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { useAdminStore } from '@/store/adminStore';

export default function AdminLoginPage() {
  const router = useRouter();
  const login = useAdminStore((s) => s.login);
  const status = useAdminStore((s) => s.status);

  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);

  const handleLogin = async () => {
    setError(null);
    try {
      await login(username, password);
      router.replace('/admin');
    } catch (e) {
      setError((e as Error).message);
    }
  };

  return (
    <ScreenContainer>
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 3 }}>
        <Stack spacing={0.5}>
          <Typography variant="h2" sx={{ fontSize: 24 }}>
            Admin Panel
          </Typography>
          <Typography variant="body2" color="text.secondary">
            SafeTag Nepal internal access only.
          </Typography>
        </Stack>

        {error && <Alert severity="error">{error}</Alert>}

        <TextField
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          fullWidth
          autoComplete="username"
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          autoComplete="current-password"
          onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
        />

        <Button size="large" variant="contained" onClick={handleLogin} disabled={status === 'loading'}>
          Sign In
        </Button>
      </Box>
    </ScreenContainer>
  );
}
