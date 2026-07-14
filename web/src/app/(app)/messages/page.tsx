'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Badge from '@mui/material/Badge';
import ChatBubbleOutlineRoundedIcon from '@mui/icons-material/ChatBubbleOutlineRounded';
import { EmptyState } from '@/components/common/EmptyState';
import { useAuthStore } from '@/store/authStore';
import { messageService } from '@/services';
import type { Conversation } from '@/types/models';
import { formatRelativeTime } from '@/utils/formatters';

export default function MessagesPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const [conversations, setConversations] = React.useState<Conversation[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!user) return;
    messageService.listConversations(user.userId).then((c) => {
      setConversations(c);
      setLoading(false);
    });
  }, [user]);

  return (
    <Box sx={{ px: 2, py: 3 }}>
      <Typography variant="h2" sx={{ fontSize: 22, mb: 2 }}>
        Messages
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : conversations.length === 0 ? (
        <EmptyState
          icon={<ChatBubbleOutlineRoundedIcon sx={{ fontSize: 48, color: 'primary.main' }} />}
          title="No messages yet"
          description="When someone messages you about a QR tag, it'll show up here."
        />
      ) : (
        <Stack spacing={1.5}>
          {conversations.map((c) => (
            <Card variant="outlined" key={c.conversationId}>
              <CardActionArea sx={{ p: 2 }} onClick={() => router.push(`/messages/${c.conversationId}`)}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Badge color="error" badgeContent={c.unreadCount} invisible={c.unreadCount === 0}>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>{c.qrLabel[0]}</Avatar>
                  </Badge>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="subtitle1">{c.qrLabel}</Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {c.lastMessage}
                    </Typography>
                  </Box>
                  {c.lastMessageAt && (
                    <Typography variant="caption" color="text.secondary">
                      {formatRelativeTime(c.lastMessageAt)}
                    </Typography>
                  )}
                </Stack>
              </CardActionArea>
            </Card>
          ))}
        </Stack>
      )}
    </Box>
  );
}
