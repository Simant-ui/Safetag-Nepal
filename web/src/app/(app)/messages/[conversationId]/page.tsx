'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import { messageService } from '@/services';
import type { Message } from '@/types/models';
import { formatDateTime } from '@/utils/formatters';

export default function ConversationPage() {
  const router = useRouter();
  const params = useParams<{ conversationId: string }>();
  const conversationId = params.conversationId;

  const [messages, setMessages] = React.useState<Message[]>([]);
  const [draft, setDraft] = React.useState('');
  const [sending, setSending] = React.useState(false);

  const load = React.useCallback(() => {
    messageService.listMessages(conversationId).then(setMessages);
  }, [conversationId]);

  React.useEffect(() => {
    load();
    messageService.markConversationRead(conversationId).catch(() => {});
  }, [conversationId, load]);

  const handleSend = async () => {
    if (!draft.trim()) return;
    setSending(true);
    try {
      await messageService.sendMessage({ conversationId, kind: 'text', body: draft.trim() });
      setDraft('');
      load();
    } finally {
      setSending(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: '70dvh' }}>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ px: 2, py: 2 }}>
        <IconButton onClick={() => router.push('/messages')} aria-label="Back to messages">
          <ArrowBackRoundedIcon />
        </IconButton>
        <Typography variant="h2" sx={{ fontSize: 20 }}>
          Conversation
        </Typography>
      </Stack>

      <Stack spacing={1.5} sx={{ flex: 1, px: 2, overflowY: 'auto' }}>
        {messages.map((m) => (
          <Box key={m.messageId} sx={{ display: 'flex', justifyContent: m.fromOwner ? 'flex-end' : 'flex-start' }}>
            <Paper
              elevation={0}
              sx={{
                px: 2,
                py: 1,
                maxWidth: '75%',
                bgcolor: m.fromOwner ? 'primary.main' : 'action.hover',
                color: m.fromOwner ? 'primary.contrastText' : 'text.primary',
                borderRadius: 3,
              }}
            >
              <Typography variant="body2">{m.kind === 'voice' ? '🎤 Voice message' : m.body}</Typography>
              <Typography variant="caption" sx={{ opacity: 0.7 }}>
                {formatDateTime(m.createdAt)}
              </Typography>
            </Paper>
          </Box>
        ))}
      </Stack>

      <Stack direction="row" spacing={1} sx={{ p: 2 }}>
        <TextField
          fullWidth
          placeholder="Type a reply..."
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <IconButton color="primary" onClick={handleSend} disabled={sending} aria-label="Send message">
          <SendRoundedIcon />
        </IconButton>
      </Stack>
    </Box>
  );
}
