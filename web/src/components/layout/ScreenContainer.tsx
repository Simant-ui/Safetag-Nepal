'use client';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import type { ReactNode } from 'react';

interface ScreenContainerProps {
  children: ReactNode;
  maxWidth?: number;
  centered?: boolean;
}

/** Centers content in a phone-width column on desktop, full-width on small screens. */
export function ScreenContainer({ children, maxWidth = 480, centered = true }: ScreenContainerProps) {
  return (
    <Box
      sx={{
        minHeight: '100dvh',
        display: 'flex',
        justifyContent: 'center',
        bgcolor: 'background.default',
      }}
    >
      <Container
        disableGutters
        sx={{
          maxWidth,
          width: '100%',
          minHeight: '100dvh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: centered ? 'stretch' : undefined,
          px: 2,
          py: 3,
        }}
      >
        {children}
      </Container>
    </Box>
  );
}
