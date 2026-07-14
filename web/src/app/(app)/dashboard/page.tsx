'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Alert from '@mui/material/Alert';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import QrCodeScannerRoundedIcon from '@mui/icons-material/QrCodeScannerRounded';
import WorkspacePremiumRoundedIcon from '@mui/icons-material/WorkspacePremiumRounded';
import DirectionsCarFilledRoundedIcon from '@mui/icons-material/DirectionsCarFilledRounded';
import StorefrontRoundedIcon from '@mui/icons-material/StorefrontRounded';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import { useAuthStore } from '@/store/authStore';
import { useQrStore } from '@/store/qrStore';
import { QR_TAG_TYPES } from '@/constants/qrTagTypes';
import { useSubscription } from '@/hooks/useSubscription';
import { vehicleService, businessService } from '@/services';
import type { Vehicle, BusinessProfile } from '@/types/models';

export default function DashboardPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const tags = useQrStore((s) => s.tags);
  const fetchTags = useQrStore((s) => s.fetchTags);
  const { plan, qrLimit } = useSubscription();

  const [vehicles, setVehicles] = React.useState<Vehicle[]>([]);
  const [businesses, setBusinesses] = React.useState<BusinessProfile[]>([]);

  React.useEffect(() => {
    if (user) fetchTags(user.userId);
  }, [user, fetchTags]);

  React.useEffect(() => {
    if (user && plan === 'business') {
      vehicleService.getByUser(user.userId).then(setVehicles);
      businessService.getByUser(user.userId).then(setBusinesses);
    }
  }, [user, plan]);

  const activeCount = tags.filter((t) => t.status === 'active').length;
  const totalScans = tags.reduce((sum, t) => sum + t.scanCount, 0);
  const atLimit = qrLimit !== null && tags.length >= qrLimit;
  const mostScanned = [...tags].sort((a, b) => b.scanCount - a.scanCount)[0];

  return (
    <Box sx={{ px: 2, py: 3 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 3 }}>
        <Stack spacing={0.5}>
          <Typography variant="body2" color="text.secondary">
            Welcome back,
          </Typography>
          <Typography variant="h2" sx={{ fontSize: 24 }}>
            {user?.name ?? 'there'}
          </Typography>
        </Stack>
        <Chip
          size="small"
          label={`${plan} plan`}
          color={plan === 'free' ? 'default' : plan === 'premium' ? 'primary' : 'secondary'}
          sx={{ textTransform: 'capitalize' }}
          onClick={() => router.push('/subscription')}
        />
      </Stack>

      {atLimit && (
        <Alert
          severity="info"
          sx={{ mb: 3 }}
          action={
            <Button size="small" onClick={() => router.push('/subscription')}>
              Upgrade
            </Button>
          }
        >
          You&apos;ve reached the Free plan&apos;s 1 QR tag limit. Upgrade to Premium for unlimited tags.
        </Alert>
      )}

      <Stack direction="row" spacing={1.5} sx={{ mb: 3 }}>
        <Card variant="outlined" sx={{ flex: 1, p: 2 }}>
          <Typography variant="h2" sx={{ fontSize: 28, color: 'primary.main' }}>
            {tags.length}
            {qrLimit !== null && <Typography component="span" variant="body2" color="text.secondary">{` / ${qrLimit}`}</Typography>}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            QR Tags
          </Typography>
        </Card>
        <Card variant="outlined" sx={{ flex: 1, p: 2 }}>
          <Typography variant="h2" sx={{ fontSize: 28, color: 'primary.main' }}>
            {activeCount}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Active
          </Typography>
        </Card>
      </Stack>

      <Stack direction="row" spacing={1.5} sx={{ mb: 4 }}>
        <Button
          fullWidth
          variant="contained"
          startIcon={<AddRoundedIcon />}
          onClick={() => router.push(atLimit ? '/subscription' : '/qr/create')}
        >
          Create QR
        </Button>
        <Button
          fullWidth
          variant="outlined"
          startIcon={<QrCodeScannerRoundedIcon />}
          onClick={() => router.push('/scan')}
        >
          Scan QR
        </Button>
      </Stack>

      {(plan === 'premium' || plan === 'business') && (
        <>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
            <WorkspacePremiumRoundedIcon color="primary" fontSize="small" />
            <Typography variant="subtitle1">Scan Analytics</Typography>
          </Stack>
          <Stack direction="row" spacing={1.5} sx={{ mb: 4 }}>
            <Card variant="outlined" sx={{ flex: 1, p: 2 }}>
              <Typography variant="h2" sx={{ fontSize: 24, color: 'primary.main' }}>
                {totalScans}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Total scans across all tags
              </Typography>
            </Card>
            <Card variant="outlined" sx={{ flex: 1, p: 2 }}>
              <Typography variant="h2" sx={{ fontSize: 16 }} noWrap>
                {mostScanned?.label || mostScanned?.type || '—'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Most-scanned tag ({mostScanned?.scanCount ?? 0} scans)
              </Typography>
            </Card>
          </Stack>
        </>
      )}

      {plan === 'business' && (
        <>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
            <GroupsRoundedIcon color="secondary" fontSize="small" />
            <Typography variant="subtitle1">Business Overview</Typography>
          </Stack>
          <Stack spacing={1} sx={{ mb: 4 }}>
            {vehicles.map((v) => (
              <Card key={v.vehicleId} variant="outlined" sx={{ p: 1.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <DirectionsCarFilledRoundedIcon color="action" />
                <Typography variant="body2">{v.vehicleNumber}</Typography>
              </Card>
            ))}
            {businesses.map((b) => (
              <Card key={b.businessId} variant="outlined" sx={{ p: 1.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <StorefrontRoundedIcon color="action" />
                <Typography variant="body2">{b.name}</Typography>
              </Card>
            ))}
            {vehicles.length === 0 && businesses.length === 0 && (
              <Typography variant="body2" color="text.secondary">
                No vehicles or businesses registered yet.
              </Typography>
            )}
            <Typography variant="caption" color="text.secondary">
              Team member management is coming soon.
            </Typography>
          </Stack>
        </>
      )}

      <Typography variant="subtitle1" sx={{ mb: 1.5 }}>
        Create a new tag
      </Typography>
      <Grid container spacing={1.5}>
        {QR_TAG_TYPES.map((type) => (
          <Grid item xs={6} sm={3} key={type.value}>
            <Card variant="outlined">
              <CardActionArea
                sx={{ p: 2 }}
                onClick={() => router.push(atLimit ? '/subscription' : `/qr/create?type=${type.value}`)}
              >
                <Chip size="small" label={type.label} color="primary" variant="outlined" sx={{ mb: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  {type.description}
                </Typography>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
