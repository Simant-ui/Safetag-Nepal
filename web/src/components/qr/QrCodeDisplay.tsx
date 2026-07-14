'use client';

import Box from '@mui/material/Box';
import { QRCodeCanvas } from 'qrcode.react';
import { colors } from '@/theme/tokens';

interface QrCodeDisplayProps {
  value: string;
  size?: number;
  id?: string;
}

export function QrCodeDisplay({ value, size = 220, id = 'qr-canvas' }: QrCodeDisplayProps) {
  return (
    <Box
      sx={{
        p: 2,
        bgcolor: '#FFFFFF',
        borderRadius: 3,
        display: 'inline-flex',
        boxShadow: 1,
      }}
    >
      <QRCodeCanvas
        id={id}
        value={value}
        size={size}
        fgColor={colors.text.primary}
        bgColor="#FFFFFF"
        level="M"
        marginSize={0}
      />
    </Box>
  );
}
