'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import QrCode2RoundedIcon from '@mui/icons-material/QrCode2Rounded';

export function BrandMark({ size = 'medium' }: { size?: 'medium' | 'large' }) {
  const iconSize = size === 'large' ? 56 : 36;
  const fontVariant = size === 'large' ? 'h2' : 'h3';

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
      <Box
        sx={{
          width: iconSize,
          height: iconSize,
          borderRadius: '28%',
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <QrCode2RoundedIcon sx={{ fontSize: iconSize * 0.62 }} />
      </Box>
      <Typography variant={fontVariant as 'h2' | 'h3'} sx={{ fontWeight: 700 }}>
        SafeTag <Box component="span" sx={{ color: 'primary.main' }}>Nepal</Box>
      </Typography>
    </Box>
  );
}
