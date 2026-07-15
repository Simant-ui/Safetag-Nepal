'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { BrandMark } from '@/components/common/BrandMark';
import { useAuthStore } from '@/store/authStore';
import { isNonEmpty, isValidEmail } from '@/utils/validators';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function RegisterProfilePage() {
  const router = useRouter();
  const completeProfile = useAuthStore((s) => s.completeProfile);
  const user = useAuthStore((s) => s.user);

  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [bloodGroup, setBloodGroup] = React.useState('');
  const [emergencyContact, setEmergencyContact] = React.useState('');
  const [address, setAddress] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    if (!user) {
      router.replace('/login');
      return;
    }
    // This phone number already has a completed profile — nothing to register, go straight in.
    if (user.name !== 'New User') {
      router.replace('/dashboard');
    }
  }, [user, router]);

  const handleSave = async () => {
    setError(null);
    if (!isNonEmpty(name)) {
      setError('Please enter your name.');
      return;
    }
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!isNonEmpty(address)) {
      setError('Please enter your address.');
      return;
    }
    setSaving(true);
    try {
      await completeProfile({ name, email, bloodGroup: bloodGroup || undefined, emergencyContact: emergencyContact || undefined, address });
      router.replace('/dashboard');
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScreenContainer>
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 3, py: 4 }}>
        <BrandMark />
        <Stack spacing={0.5}>
          <Typography variant="h2" sx={{ fontSize: 24 }}>
            Complete your profile
          </Typography>
          <Typography variant="body2" color="text.secondary">
            This helps first responders and QR scanners identify you — your phone number is never shown.
          </Typography>
        </Stack>

        {error && <Alert severity="error">{error}</Alert>}

        <TextField label="Full name" value={name} onChange={(e) => setName(e.target.value)} fullWidth required />
        <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth required />
        <TextField
          label="Blood group (optional)"
          value={bloodGroup}
          onChange={(e) => setBloodGroup(e.target.value)}
          select
          fullWidth
        >
          <MenuItem value="">Prefer not to say</MenuItem>
          {BLOOD_GROUPS.map((bg) => (
            <MenuItem key={bg} value={bg}>
              {bg}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Emergency contact number (optional)"
          value={emergencyContact}
          onChange={(e) => setEmergencyContact(e.target.value)}
          fullWidth
        />
        <TextField label="Address" value={address} onChange={(e) => setAddress(e.target.value)} fullWidth required />

        <Button size="large" variant="contained" onClick={handleSave} disabled={saving}>
          Save & Continue
        </Button>
      </Box>
    </ScreenContainer>
  );
}
