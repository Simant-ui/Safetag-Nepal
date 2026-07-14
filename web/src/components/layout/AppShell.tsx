'use client';

import * as React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import QrCode2RoundedIcon from '@mui/icons-material/QrCode2Rounded';
import ChatBubbleRoundedIcon from '@mui/icons-material/ChatBubbleRounded';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import { useAuthStore } from '@/store/authStore';
import { useNotificationStore } from '@/store/notificationStore';

const SIDEBAR_WIDTH = 232;

const NAV_ITEMS = [
  { label: 'Home', value: '/dashboard', icon: <HomeRoundedIcon /> },
  { label: 'My Tags', value: '/qr', icon: <QrCode2RoundedIcon /> },
  { label: 'Messages', value: '/messages', icon: <ChatBubbleRoundedIcon /> },
  { label: 'Alerts', value: '/notifications', icon: <NotificationsRoundedIcon /> },
  { label: 'Profile', value: '/profile', icon: <PersonRoundedIcon /> },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const unreadCount = useNotificationStore((s) => s.unreadCount());

  const activeValue = NAV_ITEMS.find((item) => pathname.startsWith(item.value))?.value ?? '/dashboard';

  return (
    <Box sx={{ minHeight: '100dvh', bgcolor: 'background.default' }}>
      <AppBar position="sticky" color="inherit" elevation={0} className="no-print" sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h3" sx={{ fontSize: 18, fontWeight: 700 }}>
            SafeTag <Box component="span" sx={{ color: 'primary.main' }}>Nepal</Box>
          </Typography>
          <IconButton onClick={() => router.push('/profile')} aria-label="Open profile">
            <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }} src={user?.profileImage}>
              {user?.name?.[0] ?? 'S'}
            </Avatar>
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box sx={{ display: 'flex' }}>
        <Box
          component="nav"
          className="no-print"
          sx={{
            display: { xs: 'none', sm: 'block' },
            width: SIDEBAR_WIDTH,
            flexShrink: 0,
            borderRight: 1,
            borderColor: 'divider',
            position: 'sticky',
            top: 64,
            height: 'calc(100dvh - 64px)',
            pt: 2,
          }}
        >
          <List>
            {NAV_ITEMS.map((item) => (
              <ListItemButton
                key={item.value}
                selected={activeValue === item.value}
                onClick={() => router.push(item.value)}
                sx={{ mx: 1, borderRadius: 2, mb: 0.5 }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  {item.value === '/notifications' && unreadCount > 0 ? (
                    <Badge badgeContent={unreadCount} color="error">
                      {item.icon}
                    </Badge>
                  ) : (
                    item.icon
                  )}
                </ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            ))}
          </List>
        </Box>

        <Box sx={{ flex: 1, minWidth: 0, display: 'flex', justifyContent: 'center' }}>
          <Box sx={{ width: '100%', maxWidth: 900, pb: { xs: 9, sm: 5 } }}>{children}</Box>
        </Box>
      </Box>

      <Paper
        elevation={3}
        className="no-print"
        sx={{ display: { xs: 'block', sm: 'none' }, position: 'fixed', bottom: 0, left: 0, right: 0 }}
      >
        <BottomNavigation showLabels value={activeValue} onChange={(_e, newValue) => router.push(newValue)}>
          {NAV_ITEMS.map((item) => (
            <BottomNavigationAction
              key={item.value}
              label={item.label}
              value={item.value}
              icon={
                item.value === '/notifications' && unreadCount > 0 ? (
                  <Badge badgeContent={unreadCount} color="error">
                    {item.icon}
                  </Badge>
                ) : (
                  item.icon
                )
              }
            />
          ))}
        </BottomNavigation>
      </Paper>
    </Box>
  );
}
