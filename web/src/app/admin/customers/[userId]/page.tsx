'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import { useAdminStore, type AdminCustomerDetail } from '@/store/adminStore';
import { formatDate, formatNepalPhoneDisplay, formatRelativeTime } from '@/utils/formatters';

const PLAN_COLOR: Record<string, 'default' | 'primary' | 'secondary'> = {
  free: 'default',
  premium: 'primary',
  business: 'secondary',
};

export default function AdminCustomerDetailPage() {
  const router = useRouter();
  const params = useParams<{ userId: string }>();
  const fetchCustomerDetail = useAdminStore((s) => s.fetchCustomerDetail);

  const [detail, setDetail] = React.useState<AdminCustomerDetail | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    fetchCustomerDetail(params.userId)
      .then(setDetail)
      .catch((e) => setError((e as Error).message));
  }, [params.userId, fetchCustomerDetail]);

  if (error) {
    return (
      <Box>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (!detail) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  const { user, subscription, qrTags, vehicles, businesses } = detail;

  return (
    <Box>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
        <IconButton onClick={() => router.push('/admin')} aria-label="Back to customers">
          <ArrowBackRoundedIcon />
        </IconButton>
        <Typography variant="h2" sx={{ fontSize: 22 }}>
          {user.name}
        </Typography>
      </Stack>

      <Card variant="outlined" sx={{ p: 2.5, mb: 3 }}>
        <Stack direction="row" spacing={4} flexWrap="wrap">
          <Box>
            <Typography variant="caption" color="text.secondary">
              Phone
            </Typography>
            <Typography variant="body1">{formatNepalPhoneDisplay(user.phone)}</Typography>
          </Box>
          {user.email && (
            <Box>
              <Typography variant="caption" color="text.secondary">
                Email
              </Typography>
              <Typography variant="body1">{user.email}</Typography>
            </Box>
          )}
          <Box>
            <Typography variant="caption" color="text.secondary">
              Joined
            </Typography>
            <Typography variant="body1">{formatDate(user.createdAt)}</Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">
              Plan
            </Typography>
            <Box>
              <Chip
                size="small"
                label={subscription?.plan ?? 'free'}
                color={PLAN_COLOR[subscription?.plan ?? 'free']}
                sx={{ textTransform: 'capitalize' }}
              />
            </Box>
          </Box>
        </Stack>
      </Card>

      <Typography variant="subtitle1" sx={{ mb: 1 }}>
        QR Tags ({qrTags.length})
      </Typography>
      <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Type</TableCell>
              <TableCell>Label</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Scans</TableCell>
              <TableCell>Created</TableCell>
              <TableCell>Last Scanned</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {qrTags.map((t) => (
              <TableRow key={t.qrId}>
                <TableCell sx={{ textTransform: 'capitalize' }}>{t.type}</TableCell>
                <TableCell>{t.label || '—'}</TableCell>
                <TableCell>
                  <Chip size="small" label={t.status} color={t.status === 'active' ? 'success' : 'default'} />
                </TableCell>
                <TableCell align="right">{t.scanCount}</TableCell>
                <TableCell>{formatDate(t.createdAt)}</TableCell>
                <TableCell>{t.lastScannedAt ? formatRelativeTime(t.lastScannedAt) : '—'}</TableCell>
              </TableRow>
            ))}
            {qrTags.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ color: 'text.secondary', py: 3 }}>
                  No QR tags created yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {vehicles.length > 0 && (
        <>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Vehicles
          </Typography>
          <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Vehicle Number</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Brand / Model</TableCell>
                  <TableCell>Year</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {vehicles.map((v) => (
                  <TableRow key={v.vehicleId}>
                    <TableCell>{v.vehicleNumber}</TableCell>
                    <TableCell sx={{ textTransform: 'capitalize' }}>{v.vehicleType}</TableCell>
                    <TableCell>{[v.brand, v.model].filter(Boolean).join(' ') || '—'}</TableCell>
                    <TableCell>{v.year ?? '—'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}

      {businesses.length > 0 && (
        <>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Businesses
          </Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Category</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {businesses.map((b) => (
                  <TableRow key={b.businessId}>
                    <TableCell>{b.name}</TableCell>
                    <TableCell>{b.category}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </Box>
  );
}
