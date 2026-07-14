'use client';

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import IconButton from '@mui/material/IconButton';
import { QR_TAG_TYPES } from '@/constants/qrTagTypes';
import type { QrTagType } from '@/types/models';
import { useAuthStore } from '@/store/authStore';
import { useQrStore } from '@/store/qrStore';
import { useSubscription } from '@/hooks/useSubscription';

export default function CreateQrPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const user = useAuthStore((s) => s.user);
  const createTag = useQrStore((s) => s.createTag);
  const tags = useQrStore((s) => s.tags);
  const { qrLimit, plan } = useSubscription();
  const atLimit = qrLimit !== null && tags.length >= qrLimit;

  const [selected, setSelected] = React.useState<QrTagType | null>(
    (searchParams.get('type') as QrTagType) || null,
  );
  const [label, setLabel] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const [saving, setSaving] = React.useState(false);

  const handleSelect = (type: QrTagType) => {
    if (type === 'vehicle') {
      router.push('/vehicle/register');
      return;
    }
    if (type === 'business') {
      router.push('/business/register');
      return;
    }
    setSelected(type);
  };

  const handleCreate = async () => {
    if (!user || !selected) return;
    setError(null);
    setSaving(true);
    try {
      const tag = await createTag(user.userId, { type: selected, label: label || undefined });
      router.replace(`/qr/${tag.qrId}/preview`);
    } catch (e) {
      setError((e as Error).message);
      setSaving(false);
    }
  };

  return (
    <Box sx={{ px: 2, py: 3 }}>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
        <IconButton onClick={() => (selected ? setSelected(null) : router.back())} aria-label="Go back">
          <ArrowBackRoundedIcon />
        </IconButton>
        <Typography variant="h2" sx={{ fontSize: 22 }}>
          Create QR Tag
        </Typography>
      </Stack>

      {atLimit ? (
        <Stack spacing={2} alignItems="flex-start">
          <Alert severity="info">
            Your {plan} plan is limited to {qrLimit} QR tag. Upgrade to Premium or Business for
            unlimited tags.
          </Alert>
          <Button variant="contained" onClick={() => router.push('/subscription')}>
            View Plans
          </Button>
        </Stack>
      ) : !selected ? (
        <Stack spacing={1.5}>
          <Typography variant="body2" color="text.secondary">
            Choose what this QR tag is for.
          </Typography>
          {QR_TAG_TYPES.map((type) => (
            <Card variant="outlined" key={type.value}>
              <CardActionArea sx={{ p: 2 }} onClick={() => handleSelect(type.value)}>
                <Typography variant="subtitle1">{type.label}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {type.description}
                </Typography>
              </CardActionArea>
            </Card>
          ))}
        </Stack>
      ) : (
        <Stack spacing={2.5}>
          <Typography variant="body2" color="text.secondary">
            Give this tag a nickname (shown to whoever scans it — never your real name unless you want it to be).
          </Typography>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField
            label="Nickname (optional)"
            placeholder={selected === 'emergency' ? 'My Emergency Profile' : 'My Backpack'}
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            fullWidth
          />
          <Button variant="contained" size="large" onClick={handleCreate} disabled={saving}>
            Create Tag
          </Button>
        </Stack>
      )}
    </Box>
  );
}
