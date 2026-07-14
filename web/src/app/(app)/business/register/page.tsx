'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import { useAuthStore } from '@/store/authStore';
import { useQrStore } from '@/store/qrStore';
import { businessService } from '@/services';
import { isNonEmpty } from '@/utils/validators';
import { useSubscription } from '@/hooks/useSubscription';

export default function BusinessRegisterPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const addTag = useQrStore((s) => s.addTag);
  const tags = useQrStore((s) => s.tags);
  const { qrLimit, plan } = useSubscription();
  const atLimit = qrLimit !== null && tags.length >= qrLimit;

  const [name, setName] = React.useState('');
  const [category, setCategory] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [website, setWebsite] = React.useState('');
  const [location, setLocation] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const [saving, setSaving] = React.useState(false);

  const handleSave = async () => {
    if (!user) return;
    setError(null);
    if (!isNonEmpty(name) || !isNonEmpty(category)) {
      setError('Please enter at least a business name and category.');
      return;
    }
    setSaving(true);
    try {
      const { qrTag } = await businessService.register(user.userId, {
        name,
        category,
        description: description || undefined,
        phone: phone || undefined,
        website: website || undefined,
        location: location || undefined,
      });
      addTag(qrTag);
      router.replace(`/qr/${qrTag.qrId}/preview`);
    } catch (e) {
      setError((e as Error).message);
      setSaving(false);
    }
  };

  return (
    <Box sx={{ px: 2, py: 3 }}>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
        <IconButton onClick={() => router.back()} aria-label="Go back">
          <ArrowBackRoundedIcon />
        </IconButton>
        <Typography variant="h2" sx={{ fontSize: 22 }}>
          Register Business
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
      ) : (
      <Stack spacing={2.5}>
        {error && <Alert severity="error">{error}</Alert>}

        <TextField label="Business name" value={name} onChange={(e) => setName(e.target.value)} fullWidth required />
        <TextField
          label="Category"
          placeholder="Restaurant, Retail Shop, Delivery Service..."
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          fullWidth
          required
        />
        <TextField
          label="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          multiline
          minRows={2}
          fullWidth
        />
        <TextField label="Public contact number (optional)" value={phone} onChange={(e) => setPhone(e.target.value)} fullWidth />
        <TextField label="Website (optional)" value={website} onChange={(e) => setWebsite(e.target.value)} fullWidth />
        <TextField label="Location (optional)" value={location} onChange={(e) => setLocation(e.target.value)} fullWidth />

        <Button variant="contained" size="large" onClick={handleSave} disabled={saving}>
          Register & Generate QR
        </Button>
      </Stack>
      )}
    </Box>
  );
}
