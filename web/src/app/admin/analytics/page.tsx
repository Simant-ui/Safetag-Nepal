'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { API_BASE_URL } from '@/constants/appConfig';
import { useAdminStore } from '@/store/adminStore';

interface Analytics {
  totalScans: number;
  totalCallClicks: number;
  dailyReport: { date: string; calls: number }[];
  monthlyReport: { month: string; calls: number }[];
  vehicleWise: { vehicleId: string; vehicleNumber: string; scanCount: number; callCount: number }[];
}

export default function AdminAnalyticsPage() {
  const token = useAdminStore((s) => s.token);
  const [data, setData] = React.useState<Analytics | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!token) return;
    fetch(`${API_BASE_URL}/admin/analytics`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      });
  }, [token]);

  if (loading || !data) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h2" sx={{ fontSize: 22, mb: 2 }}>
        Analytics
      </Typography>

      <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
        <Card variant="outlined" sx={{ flex: 1, p: 2 }}>
          <Typography variant="h2" sx={{ fontSize: 28, color: 'primary.main' }}>
            {data.totalScans}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Total QR Scans
          </Typography>
        </Card>
        <Card variant="outlined" sx={{ flex: 1, p: 2 }}>
          <Typography variant="h2" sx={{ fontSize: 28, color: 'primary.main' }}>
            {data.totalCallClicks}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Total Call Button Clicks
          </Typography>
        </Card>
      </Stack>

      <Typography variant="subtitle1" sx={{ mb: 1 }}>
        Daily calls (last 30 days)
      </Typography>
      <TableContainer component={Paper} variant="outlined" sx={{ mb: 3, maxHeight: 260 }}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell align="right">Calls</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.dailyReport.map((row) => (
              <TableRow key={row.date}>
                <TableCell>{row.date}</TableCell>
                <TableCell align="right">{row.calls}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Typography variant="subtitle1" sx={{ mb: 1 }}>
        Monthly calls
      </Typography>
      <TableContainer component={Paper} variant="outlined" sx={{ mb: 3, maxHeight: 260 }}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Month</TableCell>
              <TableCell align="right">Calls</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.monthlyReport.map((row) => (
              <TableRow key={row.month}>
                <TableCell>{row.month}</TableCell>
                <TableCell align="right">{row.calls}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Typography variant="subtitle1" sx={{ mb: 1 }}>
        Vehicle-wise
      </Typography>
      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Vehicle Number</TableCell>
              <TableCell align="right">Scans</TableCell>
              <TableCell align="right">Call Clicks</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.vehicleWise.map((row) => (
              <TableRow key={row.vehicleId}>
                <TableCell>{row.vehicleNumber}</TableCell>
                <TableCell align="right">{row.scanCount}</TableCell>
                <TableCell align="right">{row.callCount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
