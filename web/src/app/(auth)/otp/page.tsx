'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { BrandMark } from '@/components/common/BrandMark';
import { useAuthStore } from '@/store/authStore';
import { isValidOtpCode } from '@/utils/validators';

export default function OtpPage() {
  const router = useRouter();
  const verifyOtp = useAuthStore((s) => s.verifyOtp);
  const devOtpCode = useAuthStore((s) => s.devOtpCode);
  const pendingOtpRequestId = useAuthStore((s) => s.pendingOtpRequestId);
  const status = useAuthStore((s) => s.status);

  const [code, setCode] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!pendingOtpRequestId) router.replace('/login');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleVerify = async () => {
    setError(null);
    if (!isValidOtpCode(code)) {
      setError('Enter the 4-digit code.');
      return;
    }
    try {
      await verifyOtp(code);
      const user = useAuthStore.getState().user;
      router.replace(user?.name === 'New User' ? '/register' : '/dashboard');
    } catch (e) {
      setError((e as Error).message);
    }
  };

  return (
    <ScreenContainer>
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 4 }}>
        <BrandMark />
        <Stack spacing={0.5}>
          <Typography variant="h2" sx={{ fontSize: 24 }}>
            Enter verification code
          </Typography>
          <Typography variant="body2" color="text.secondary">
            We sent a 4-digit code to your phone.
          </Typography>
        </Stack>

        {devOtpCode && (
          <Alert severity="info">
            Dev mode: no real SMS is sent yet. Your code is the last 4 digits of your phone
            number: <strong>{devOtpCode}</strong>.
          </Alert>
        )}
        {error && <Alert severity="error">{error}</Alert>}

        <TextField
          label="4-digit code"
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 4))}
          fullWidth
          inputProps={{ inputMode: 'numeric', maxLength: 4, style: { letterSpacing: 8, fontSize: 22 } }}
        />

        <Button size="large" variant="contained" onClick={handleVerify} disabled={status === 'loading'}>
          Verify & Continue
        </Button>
      </Box>
    </ScreenContainer>
  );
}
