'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import { useAuthStore } from '@/store/authStore';
import { useQrStore } from '@/store/qrStore';
import { vehicleService } from '@/services';
import type { VehicleType } from '@/types/models';
import { isNonEmpty } from '@/utils/validators';
import { useSubscription } from '@/hooks/useSubscription';

const VEHICLE_TYPES: { value: VehicleType; label: string }[] = [
  { value: 'car', label: 'Car' },
  { value: 'bike', label: 'Motorbike' },
  { value: 'scooter', label: 'Scooter' },
  { value: 'truck', label: 'Truck' },
  { value: 'other', label: 'Other' },
];

export default function VehicleRegisterPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const addTag = useQrStore((s) => s.addTag);
  const tags = useQrStore((s) => s.tags);
  const { qrLimit, plan } = useSubscription();
  const atLimit = qrLimit !== null && tags.length >= qrLimit;

  const [vehicleNumber, setVehicleNumber] = React.useState('');
  const [vehicleType, setVehicleType] = React.useState<VehicleType>('car');
  const [brand, setBrand] = React.useState('');
  const [model, setModel] = React.useState('');
  const [color, setColor] = React.useState('');
  const [year, setYear] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const [saving, setSaving] = React.useState(false);

  const handleSave = async () => {
    if (!user) return;
    setError(null);
    if (!isNonEmpty(vehicleNumber)) {
      setError('Please enter the vehicle number.');
      return;
    }
    setSaving(true);
    try {
      const { qrTag } = await vehicleService.register(user.userId, {
        vehicleNumber,
        vehicleType,
        brand: brand || undefined,
        model: model || undefined,
        color: color || undefined,
        year: year ? Number(year) : undefined,
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
          Register Vehicle
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

        <TextField
          label="Vehicle number"
          placeholder="BA 2 PA 1234"
          value={vehicleNumber}
          onChange={(e) => setVehicleNumber(e.target.value.toUpperCase())}
          fullWidth
          required
        />
        <TextField label="Vehicle type" select value={vehicleType} onChange={(e) => setVehicleType(e.target.value as VehicleType)} fullWidth>
          {VEHICLE_TYPES.map((t) => (
            <MenuItem key={t.value} value={t.value}>
              {t.label}
            </MenuItem>
          ))}
        </TextField>
        <Stack direction="row" spacing={2}>
          <TextField label="Brand" value={brand} onChange={(e) => setBrand(e.target.value)} fullWidth />
          <TextField label="Model" value={model} onChange={(e) => setModel(e.target.value)} fullWidth />
        </Stack>
        <Stack direction="row" spacing={2}>
          <TextField label="Color" value={color} onChange={(e) => setColor(e.target.value)} fullWidth />
          <TextField
            label="Year"
            value={year}
            onChange={(e) => setYear(e.target.value.replace(/\D/g, '').slice(0, 4))}
            fullWidth
          />
        </Stack>

        <Button variant="contained" size="large" onClick={handleSave} disabled={saving}>
          Register & Generate QR
        </Button>
      </Stack>
      )}
    </Box>
  );
}
