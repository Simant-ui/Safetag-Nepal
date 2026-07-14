'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import NotificationsNoneRoundedIcon from '@mui/icons-material/NotificationsNoneRounded';
import LocalHospitalRoundedIcon from '@mui/icons-material/LocalHospitalRounded';
import DirectionsCarFilledRoundedIcon from '@mui/icons-material/DirectionsCarFilledRounded';
import ChatBubbleRoundedIcon from '@mui/icons-material/ChatBubbleRounded';
import CampaignRoundedIcon from '@mui/icons-material/CampaignRounded';
import { EmptyState } from '@/components/common/EmptyState';
import { useAuthStore } from '@/store/authStore';
import { useNotificationStore } from '@/store/notificationStore';
import { formatRelativeTime } from '@/utils/formatters';
import type { NotificationCategory } from '@/types/models';

const CATEGORY_ICON: Record<NotificationCategory, React.ReactNode> = {
  contact_request: <ChatBubbleRoundedIcon />,
  emergency: <LocalHospitalRoundedIcon />,
  wrong_parking: <DirectionsCarFilledRoundedIcon />,
  message: <ChatBubbleRoundedIcon />,
  system: <CampaignRoundedIcon />,
};

const CATEGORY_COLOR: Record<NotificationCategory, 'primary' | 'error' | 'warning'> = {
  contact_request: 'primary',
  emergency: 'error',
  wrong_parking: 'warning',
  message: 'primary',
  system: 'primary',
};

export default function NotificationsPage() {
  const user = useAuthStore((s) => s.user);
  const items = useNotificationStore((s) => s.items);
  const loading = useNotificationStore((s) => s.loading);
  const fetchAll = useNotificationStore((s) => s.fetchAll);
  const markRead = useNotificationStore((s) => s.markRead);

  React.useEffect(() => {
    if (user) fetchAll(user.userId);
  }, [user, fetchAll]);

  return (
    <Box sx={{ px: 2, py: 3 }}>
      <Typography variant="h2" sx={{ fontSize: 22, mb: 2 }}>
        Notifications
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : items.length === 0 ? (
        <EmptyState
          icon={<NotificationsNoneRoundedIcon sx={{ fontSize: 48, color: 'primary.main' }} />}
          title="You're all caught up"
          description="Scan activity and alerts about your QR tags will appear here."
        />
      ) : (
        <Stack spacing={1.5}>
          {items.map((n) => (
            <Card variant="outlined" key={n.notificationId} sx={{ opacity: n.read ? 0.65 : 1 }}>
              <CardActionArea sx={{ p: 2 }} onClick={() => markRead(n.notificationId)}>
                <Stack direction="row" spacing={1.5} alignItems="flex-start">
                  <Avatar sx={{ bgcolor: `${CATEGORY_COLOR[n.category]}.main`, width: 36, height: 36 }}>
                    {CATEGORY_ICON[n.category]}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle1">{n.title}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {n.body}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatRelativeTime(n.createdAt)}
                    </Typography>
                  </Box>
                </Stack>
              </CardActionArea>
            </Card>
          ))}
        </Stack>
      )}
    </Box>
  );
}
