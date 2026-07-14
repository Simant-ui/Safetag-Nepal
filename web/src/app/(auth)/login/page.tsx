'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import InputAdornment from '@mui/material/InputAdornment';
import GoogleIcon from '@mui/icons-material/Google';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { BrandMark } from '@/components/common/BrandMark';
import { useAuthStore } from '@/store/authStore';
import { isValidNepalPhone, normalizePhoneInput } from '@/utils/validators';

type Mode = 'login' | 'signup';

const COPY: Record<Mode, { heading: string; subtext: string; button: string }> = {
  login: {
    heading: 'Welcome back',
    subtext: 'Log in with your phone number to manage your QR tags.',
    button: 'Log In',
  },
  signup: {
    heading: 'Create your account',
    subtext: 'Sign up with your phone number — takes less than a minute.',
    button: 'Sign Up',
  },
};

export default function LoginPage() {
  const router = useRouter();
  const sendOtp = useAuthStore((s) => s.sendOtp);
  const loginWithGoogle = useAuthStore((s) => s.loginWithGoogle);
  const status = useAuthStore((s) => s.status);

  const [mode, setMode] = React.useState<Mode>('login');
  const [phone, setPhone] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);

  const handleContinue = async () => {
    setError(null);
    if (!isValidNepalPhone(phone)) {
      setError('Enter a valid Nepal mobile number (starts with 97 or 98).');
      return;
    }
    try {
      // Login requires an already-registered (profile-complete) number; Sign Up requires the
      // number NOT be registered yet. The backend enforces this and returns a clear error
      // otherwise (e.g. "This number is not registered. Please sign up first.").
      await sendOtp(normalizePhoneInput(phone), mode);
      router.push('/otp');
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const handleGoogle = async () => {
    setError(null);
    try {
      await loginWithGoogle();
      router.replace('/dashboard');
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const copy = COPY[mode];

  return (
    <ScreenContainer>
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 3 }}>
        <BrandMark />

        <Tabs
          value={mode}
          onChange={(_e, v) => {
            setMode(v);
            setError(null);
          }}
          variant="fullWidth"
        >
          <Tab label="Log In" value="login" />
          <Tab label="Sign Up" value="signup" />
        </Tabs>

        <Stack spacing={0.5}>
          <Typography variant="h2" sx={{ fontSize: 24 }}>
            {copy.heading}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {copy.subtext}
          </Typography>
        </Stack>

        {error && (
          <Alert
            severity="error"
            action={
              /already registered|not registered/.test(error) ? (
                <Button
                  size="small"
                  color="inherit"
                  onClick={() => {
                    setMode(mode === 'login' ? 'signup' : 'login');
                    setError(null);
                  }}
                >
                  Switch to {mode === 'login' ? 'Sign Up' : 'Log In'}
                </Button>
              ) : undefined
            }
          >
            {error}
          </Alert>
        )}

        <TextField
          label="Mobile number"
          placeholder="98XXXXXXXX"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          slotProps={{
            input: {
              startAdornment: <InputAdornment position="start">+977</InputAdornment>,
            },
          }}
          fullWidth
        />

        <Button size="large" variant="contained" onClick={handleContinue} disabled={status === 'loading'}>
          {copy.button}
        </Button>

        <Divider>or</Divider>

        <Button
          size="large"
          variant="outlined"
          startIcon={<GoogleIcon />}
          onClick={handleGoogle}
          disabled={status === 'loading'}
        >
          Continue with Google
        </Button>

        <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center' }}>
          Demo tip: sign in with 9841234567 to see a pre-populated demo account, or any other Nepal
          number to create a fresh one.
        </Typography>
      </Box>
    </ScreenContainer>
  );
}
