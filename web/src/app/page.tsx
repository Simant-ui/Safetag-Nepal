'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import ShieldRoundedIcon from '@mui/icons-material/ShieldRounded';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { BrandMark } from '@/components/common/BrandMark';
import { useAuthStore } from '@/store/authStore';
import { useUiStore } from '@/store/uiStore';

export default function LandingPage() {
  const router = useRouter();
  const status = useAuthStore((s) => s.status);
  const hasSeenOnboarding = useUiStore((s) => s.hasSeenOnboarding);
  const markOnboardingSeen = useUiStore((s) => s.markOnboardingSeen);
  const loadPrefs = useUiStore((s) => s.loadPrefs);

  React.useEffect(() => {
    loadPrefs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (status === 'authenticated') router.replace('/dashboard');
    if (status === 'unauthenticated' && hasSeenOnboarding) router.replace('/login');
  }, [status, hasSeenOnboarding, router]);

  if (status === 'idle' || status === 'loading') {
    return (
      <ScreenContainer>
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CircularProgress color="primary" />
        </Box>
      </ScreenContainer>
    );
  }

  if (hasSeenOnboarding) {
    return null;
  }

  return (
    <ScreenContainer>
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 5 }}>
        <BrandMark size="large" />
        <Stack spacing={2}>
          <Typography variant="h1" sx={{ fontSize: 30 }}>
            Contact without exposing your number.
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Create QR tags for your vehicle, emergency profile, belongings, or business. Anyone who
            scans can reach you instantly — your real phone number stays private, always.
          </Typography>
        </Stack>
        <Stack direction="row" spacing={1.5} sx={{ color: 'text.secondary' }} alignItems="center">
          <ShieldRoundedIcon color="primary" />
          <Typography variant="body2">Your number is never shown to scanners.</Typography>
        </Stack>
        <Stack spacing={1.5}>
          <Button
            size="large"
            variant="contained"
            onClick={() => {
              markOnboardingSeen();
              router.replace('/login');
            }}
          >
            Sign Up
          </Button>
          <Button
            size="large"
            variant="outlined"
            onClick={() => {
              markOnboardingSeen();
              router.replace('/login');
            }}
          >
            Log In
          </Button>
        </Stack>
      </Box>
    </ScreenContainer>
  );
}
