'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { ReactNode } from 'react';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: 1.5,
        py: 6,
        px: 3,
        color: 'text.secondary',
      }}
    >
      {icon}
      <Typography variant="subtitle1" color="text.primary">
        {title}
      </Typography>
      {description && <Typography variant="body2">{description}</Typography>}
      {action}
    </Box>
  );
}
