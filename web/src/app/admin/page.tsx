'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import InputAdornment from '@mui/material/InputAdornment';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { useAdminStore, type AdminCustomer } from '@/store/adminStore';
import { formatDate, formatNepalPhoneDisplay } from '@/utils/formatters';

const PLAN_COLOR: Record<string, 'default' | 'primary' | 'secondary'> = {
  free: 'default',
  premium: 'primary',
  business: 'secondary',
};

export default function AdminCustomersPage() {
  const router = useRouter();
  const customers = useAdminStore((s) => s.customers);
  const loading = useAdminStore((s) => s.loadingCustomers);
  const fetchCustomers = useAdminStore((s) => s.fetchCustomers);
  const updateCustomerPlan = useAdminStore((s) => s.updateCustomerPlan);
  const createCustomer = useAdminStore((s) => s.createCustomer);

  const [search, setSearch] = React.useState('');
  const [editing, setEditing] = React.useState<AdminCustomer | null>(null);
  const [plan, setPlan] = React.useState('free');
  const [durationDays, setDurationDays] = React.useState('30');
  const [saving, setSaving] = React.useState(false);

  const [createOpen, setCreateOpen] = React.useState(false);
  const [newName, setNewName] = React.useState('');
  const [newPhone, setNewPhone] = React.useState('');
  const [newEmail, setNewEmail] = React.useState('');
  const [newVehicleNumber, setNewVehicleNumber] = React.useState('');
  const [newBrand, setNewBrand] = React.useState('');
  const [newModel, setNewModel] = React.useState('');
  const [newYear, setNewYear] = React.useState('');
  const [createError, setCreateError] = React.useState<string | null>(null);
  const [creating, setCreating] = React.useState(false);

  React.useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const filtered = customers.filter((c) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return c.phone.toLowerCase().includes(q) || c.name.toLowerCase().includes(q);
  });

  const openEdit = (customer: AdminCustomer) => {
    setEditing(customer);
    setPlan(customer.subscription?.plan ?? 'free');
    setDurationDays('30');
  };

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      await updateCustomerPlan(editing.userId, plan, plan === 'free' ? undefined : Number(durationDays));
      setEditing(null);
    } finally {
      setSaving(false);
    }
  };

  const resetCreateForm = () => {
    setNewName('');
    setNewPhone('');
    setNewEmail('');
    setNewVehicleNumber('');
    setNewBrand('');
    setNewModel('');
    setNewYear('');
    setCreateError(null);
  };

  const handleCreate = async () => {
    setCreateError(null);
    if (!newName.trim() || !newPhone.trim()) {
      setCreateError('Name and phone number are required.');
      return;
    }
    if (!newVehicleNumber.trim() || !newBrand.trim() || !newModel.trim() || !newYear.trim()) {
      setCreateError('Vehicle number, brand, model, and year are all required.');
      return;
    }
    setCreating(true);
    try {
      await createCustomer({
        name: newName.trim(),
        phone: newPhone.trim(),
        email: newEmail.trim() || undefined,
        vehicleNumber: newVehicleNumber.trim(),
        brand: newBrand.trim(),
        model: newModel.trim(),
        year: Number(newYear),
      });
      setCreateOpen(false);
      resetCreateForm();
    } catch (e) {
      setCreateError((e as Error).message);
    } finally {
      setCreating(false);
    }
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h2" sx={{ fontSize: 22 }}>
          Customers
        </Typography>
        <Button variant="contained" startIcon={<AddRoundedIcon />} onClick={() => setCreateOpen(true)}>
          Create Customer
        </Button>
      </Stack>

      <TextField
        placeholder="Search by name or phone number..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
        slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchRoundedIcon /></InputAdornment> } }}
      />

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Joined</TableCell>
                <TableCell align="center">QR Tags</TableCell>
                <TableCell>Plan</TableCell>
                <TableCell>Expires</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((c) => (
                <TableRow key={c.userId}>
                  <TableCell>{c.name}</TableCell>
                  <TableCell>{formatNepalPhoneDisplay(c.phone)}</TableCell>
                  <TableCell>{formatDate(c.createdAt)}</TableCell>
                  <TableCell align="center">{c.qrTagCount}</TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={c.subscription?.plan ?? 'free'}
                      color={PLAN_COLOR[c.subscription?.plan ?? 'free']}
                      sx={{ textTransform: 'capitalize' }}
                    />
                  </TableCell>
                  <TableCell>{c.subscription?.endDate ? formatDate(c.subscription.endDate) : '—'}</TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <Button size="small" onClick={() => router.push(`/admin/customers/${c.userId}`)}>
                        View Detail
                      </Button>
                      <Button size="small" onClick={() => openEdit(c)}>
                        Change Plan
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ color: 'text.secondary', py: 4 }}>
                    No customers match &quot;{search}&quot;.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={!!editing} onClose={() => setEditing(null)} fullWidth maxWidth="xs">
        <DialogTitle>Change plan — {editing?.name}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField label="Plan" select value={plan} onChange={(e) => setPlan(e.target.value)} fullWidth>
              <MenuItem value="free">Free</MenuItem>
              <MenuItem value="premium">Premium</MenuItem>
              <MenuItem value="business">Business</MenuItem>
            </TextField>
            {plan !== 'free' && (
              <TextField
                label="Duration (days)"
                value={durationDays}
                onChange={(e) => setDurationDays(e.target.value.replace(/\D/g, ''))}
                fullWidth
              />
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditing(null)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} disabled={saving}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={createOpen}
        onClose={() => {
          setCreateOpen(false);
          resetCreateForm();
        }}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Create Customer</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            {createError && <Alert severity="error">{createError}</Alert>}
            <TextField label="Full name" value={newName} onChange={(e) => setNewName(e.target.value)} fullWidth required />
            <TextField
              label="Phone number"
              placeholder="98XXXXXXXX"
              value={newPhone}
              onChange={(e) => setNewPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
              fullWidth
              required
            />
            <TextField label="Email (optional)" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} fullWidth />
            <Divider>Vehicle (required)</Divider>
            <TextField
              label="Vehicle number"
              placeholder="BA 2 PA 1234"
              value={newVehicleNumber}
              onChange={(e) => setNewVehicleNumber(e.target.value.toUpperCase())}
              fullWidth
              required
            />
            <Stack direction="row" spacing={2}>
              <TextField label="Brand" value={newBrand} onChange={(e) => setNewBrand(e.target.value)} fullWidth required />
              <TextField label="Model" value={newModel} onChange={(e) => setNewModel(e.target.value)} fullWidth required />
            </Stack>
            <TextField
              label="Year"
              value={newYear}
              onChange={(e) => setNewYear(e.target.value.replace(/\D/g, '').slice(0, 4))}
              fullWidth
              required
            />
            <Typography variant="caption" color="text.secondary">
              When this customer logs in with this phone number, they&apos;ll go straight to their
              dashboard — no signup step needed.
            </Typography>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setCreateOpen(false);
              resetCreateForm();
            }}
          >
            Cancel
          </Button>
          <Button variant="contained" onClick={handleCreate} disabled={creating}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
