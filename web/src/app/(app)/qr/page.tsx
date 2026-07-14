'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Fab from '@mui/material/Fab';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import QrCode2RoundedIcon from '@mui/icons-material/QrCode2Rounded';
import { EmptyState } from '@/components/common/EmptyState';
import { QrTagCard } from '@/components/qr/QrTagCard';
import { useAuthStore } from '@/store/authStore';
import { useQrStore } from '@/store/qrStore';

export default function MyQrTagsPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const tags = useQrStore((s) => s.tags);
  const loading = useQrStore((s) => s.loading);
  const fetchTags = useQrStore((s) => s.fetchTags);
  const setStatus = useQrStore((s) => s.setStatus);

  React.useEffect(() => {
    if (user) fetchTags(user.userId);
  }, [user, fetchTags]);

  return (
    <Box sx={{ px: 2, py: 3, position: 'relative', minHeight: '60dvh' }}>
      <Typography variant="h2" sx={{ fontSize: 22, mb: 2 }}>
        My QR Tags
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : tags.length === 0 ? (
        <EmptyState
          icon={<QrCode2RoundedIcon sx={{ fontSize: 48, color: 'primary.main' }} />}
          title="No QR tags yet"
          description="Create your first QR tag for a vehicle, emergency profile, item, or business."
          action={
            <Button variant="contained" startIcon={<AddRoundedIcon />} onClick={() => router.push('/qr/create')}>
              Create QR Tag
            </Button>
          }
        />
      ) : (
        <Stack spacing={1.5}>
          {tags.map((tag) => (
            <QrTagCard
              key={tag.qrId}
              tag={tag}
              onOpen={() => router.push(`/qr/${tag.qrId}/preview`)}
              onToggleStatus={(active) => setStatus(tag.qrId, active ? 'active' : 'inactive')}
            />
          ))}
        </Stack>
      )}

      <Fab
        color="primary"
        sx={{ position: 'fixed', bottom: { xs: 88, sm: 32 }, right: { xs: 20, sm: 40 } }}
        onClick={() => router.push('/qr/create')}
        aria-label="Create QR tag"
      >
        <AddRoundedIcon />
      </Fab>
    </Box>
  );
}
