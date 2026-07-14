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
import { userService } from '@/services';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function EditProfilePage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  const [name, setName] = React.useState(user?.name ?? '');
  const [email, setEmail] = React.useState(user?.email ?? '');
  const [bloodGroup, setBloodGroup] = React.useState(user?.bloodGroup ?? '');
  const [emergencyContact, setEmergencyContact] = React.useState(user?.emergencyContact ?? '');
  const [address, setAddress] = React.useState(user?.address ?? '');
  const [error, setError] = React.useState<string | null>(null);
  const [saving, setSaving] = React.useState(false);

  if (!user) return null;

  const handleSave = async () => {
    setError(null);
    setSaving(true);
    try {
      await userService.updateProfile(user.userId, {
        name,
        email: email || undefined,
        bloodGroup: bloodGroup || undefined,
        emergencyContact: emergencyContact || undefined,
        address: address || undefined,
      });
      useAuthStore.setState({
        user: { ...user, name, email, bloodGroup, emergencyContact, address },
      });
      router.back();
    } catch (e) {
      setError((e as Error).message);
    } finally {
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
          Edit Profile
        </Typography>
      </Stack>

      <Stack spacing={2.5}>
        {error && <Alert severity="error">{error}</Alert>}
        <TextField label="Full name" value={name} onChange={(e) => setName(e.target.value)} fullWidth />
        <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth />
        <TextField label="Blood group" value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value)} select fullWidth>
          <MenuItem value="">Prefer not to say</MenuItem>
          {BLOOD_GROUPS.map((bg) => (
            <MenuItem key={bg} value={bg}>
              {bg}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Emergency contact number"
          value={emergencyContact}
          onChange={(e) => setEmergencyContact(e.target.value)}
          fullWidth
        />
        <TextField label="Address" value={address} onChange={(e) => setAddress(e.target.value)} fullWidth />

        <Button variant="contained" size="large" onClick={handleSave} disabled={saving}>
          Save Changes
        </Button>
      </Stack>
    </Box>
  );
}
