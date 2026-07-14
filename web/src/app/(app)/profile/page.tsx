'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import WorkspacePremiumRoundedIcon from '@mui/icons-material/WorkspacePremiumRounded';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import { useAuthStore } from '@/store/authStore';
import { useUiStore } from '@/store/uiStore';
import { formatNepalPhoneDisplay } from '@/utils/formatters';

export default function ProfilePage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const themeMode = useUiStore((s) => s.themeMode);
  const setThemeMode = useUiStore((s) => s.setThemeMode);

  if (!user) return null;

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  return (
    <Box sx={{ px: 2, py: 3 }}>
      <Card variant="outlined" sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, mb: 3 }}>
        <Avatar sx={{ width: 72, height: 72, bgcolor: 'primary.main', fontSize: 28 }} src={user.profileImage}>
          {user.name[0]}
        </Avatar>
        <Typography variant="h2" sx={{ fontSize: 20 }}>
          {user.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          +977 {formatNepalPhoneDisplay(user.phone)}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Only visible to you — scanners never see this number.
        </Typography>
        <Button
          startIcon={<EditRoundedIcon />}
          variant="outlined"
          size="small"
          onClick={() => router.push('/profile/edit')}
        >
          Edit Profile
        </Button>
      </Card>

      <Card variant="outlined">
        <List disablePadding>
          <ListItemButton onClick={() => router.push('/subscription')}>
            <ListItemIcon>
              <WorkspacePremiumRoundedIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary="Subscription" secondary="Manage your plan" />
            <ChevronRightRoundedIcon color="disabled" />
          </ListItemButton>
          <Divider component="li" />
          <ListItemButton onClick={(e) => e.preventDefault()} disableRipple>
            <ListItemIcon>
              <DarkModeRoundedIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary="Dark mode" />
            <Stack direction="row" spacing={0.5}>
              <Switch
                checked={themeMode === 'dark'}
                onChange={(e) => setThemeMode(e.target.checked ? 'dark' : 'light')}
              />
            </Stack>
          </ListItemButton>
          <Divider component="li" />
          <ListItemButton onClick={handleLogout}>
            <ListItemIcon>
              <LogoutRoundedIcon color="error" />
            </ListItemIcon>
            <ListItemText primary="Log out" slotProps={{ primary: { color: 'error' } }} />
          </ListItemButton>
        </List>
      </Card>
    </Box>
  );
}
