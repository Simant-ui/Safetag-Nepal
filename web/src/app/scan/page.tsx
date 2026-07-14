'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import { QrScanner } from '@/components/qr/QrScanner';
import { ScreenContainer } from '@/components/layout/ScreenContainer';

function extractQrId(scanned: string): string {
  try {
    const url = new URL(scanned);
    const parts = url.pathname.split('/').filter(Boolean);
    return parts[parts.length - 1];
  } catch {
    return scanned.trim();
  }
}

export default function ScanPage() {
  const router = useRouter();
  const [manualCode, setManualCode] = React.useState('');

  const handleResult = (decodedText: string) => {
    const qrId = extractQrId(decodedText);
    if (qrId) router.push(`/q/${qrId}`);
  };

  return (
    <ScreenContainer>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2, mt: 1 }}>
        <IconButton onClick={() => router.back()} aria-label="Go back">
          <ArrowBackRoundedIcon />
        </IconButton>
        <Typography variant="h2" sx={{ fontSize: 22 }}>
          Scan QR
        </Typography>
      </Stack>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Point your camera at a SafeTag QR sticker.
      </Typography>

      <QrScanner onResult={handleResult} />

      <Divider sx={{ my: 3 }}>or enter the code manually</Divider>

      <Stack direction="row" spacing={1.5}>
        <TextField
          fullWidth
          placeholder="qr_xxxxxxxxxxxx"
          value={manualCode}
          onChange={(e) => setManualCode(e.target.value)}
        />
        <Button
          variant="contained"
          onClick={() => manualCode && router.push(`/q/${extractQrId(manualCode)}`)}
        >
          Go
        </Button>
      </Stack>

      <Box sx={{ flex: 1 }} />
    </ScreenContainer>
  );
}
