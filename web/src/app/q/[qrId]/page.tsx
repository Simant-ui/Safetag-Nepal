'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import PhoneRoundedIcon from '@mui/icons-material/PhoneRounded';
import ChatBubbleRoundedIcon from '@mui/icons-material/ChatBubbleRounded';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import LocalHospitalRoundedIcon from '@mui/icons-material/LocalHospitalRounded';
import DirectionsCarFilledRoundedIcon from '@mui/icons-material/DirectionsCarFilledRounded';
import ShieldRoundedIcon from '@mui/icons-material/ShieldRounded';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { BrandMark } from '@/components/common/BrandMark';
import { qrService, contactService } from '@/services';
import type { PublicOwnerView, ContactRequestType } from '@/types/models';
import { getQrTagTypeMeta } from '@/constants/qrTagTypes';
import { API_BASE_URL, USE_MOCK_API } from '@/constants/appConfig';

type DialogMode = ContactRequestType | null;

export default function PublicContactPage() {
  const params = useParams<{ qrId: string }>();
  const qrId = params.qrId;

  const [view, setView] = React.useState<PublicOwnerView | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [loadError, setLoadError] = React.useState<string | null>(null);
  const [dialogMode, setDialogMode] = React.useState<DialogMode>(null);
  const [message, setMessage] = React.useState('');
  const [callerName, setCallerName] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);
  const [successNotice, setSuccessNotice] = React.useState<string | null>(null);

  React.useEffect(() => {
    qrService
      .getTagPublic(qrId)
      .then((result) => {
        setView(result);
        qrService.recordScan(qrId).catch(() => {});
      })
      .catch((e) => setLoadError((e as Error).message))
      .finally(() => setLoading(false));
  }, [qrId]);

  const closeDialog = () => {
    setDialogMode(null);
    setMessage('');
    setCallerName('');
  };

  const handleCallOwner = async () => {
    if (!USE_MOCK_API) {
      // Full top-level navigation (not fetch) so the backend can 302-redirect straight to a
      // tel: URI — the phone number never touches a JSON response or this page's rendered
      // text, only a server-side redirect. See server/src/controllers/contactController.ts
      // (dialCall) and utils/callProvider.ts for the swappable masking-ready implementation.
      window.location.href = `${API_BASE_URL}/public/qr/${qrId}/call/dial`;
      return;
    }

    // Mock/demo mode has no real phone number to dial, so fall back to the notify-only flow.
    setSubmitting(true);
    try {
      await contactService.initiateCallRequest(qrId);
      setSuccessNotice('Call request sent. The owner has been notified and can call you back.');
    } catch (e) {
      setSuccessNotice((e as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitDialog = async () => {
    if (!dialogMode) return;
    setSubmitting(true);
    try {
      await contactService.sendContactRequest({
        qrId,
        requestType: dialogMode,
        message: message || undefined,
        callerInfo: callerName ? { name: callerName } : undefined,
      });
      setSuccessNotice(
        dialogMode === 'emergency'
          ? 'Emergency alert sent. The owner has been notified immediately.'
          : dialogMode === 'wrong_parking'
            ? 'The owner has been notified that their vehicle needs attention.'
            : 'Your message has been sent to the owner.',
      );
      closeDialog();
    } catch (e) {
      setSuccessNotice((e as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <ScreenContainer>
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      </ScreenContainer>
    );
  }

  if (loadError || !view) {
    return (
      <ScreenContainer>
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2, textAlign: 'center' }}>
          <BrandMark />
          <Alert severity="warning">{loadError ?? 'This QR tag could not be found.'}</Alert>
        </Box>
      </ScreenContainer>
    );
  }

  const meta = getQrTagTypeMeta(view.tagType);

  return (
    <ScreenContainer>
      <Box sx={{ py: 3 }}>
        <BrandMark />

        <Card variant="outlined" sx={{ mt: 3, p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5, textAlign: 'center' }}>
          <Avatar sx={{ width: 64, height: 64, bgcolor: 'primary.main', fontSize: 28 }}>
            {view.nickname[0]?.toUpperCase()}
          </Avatar>
          <Chip label={meta.label} color="primary" variant="outlined" size="small" />
          <Typography variant="h2" sx={{ fontSize: 22 }}>
            {view.nickname}
          </Typography>

          {view.tagType === 'vehicle' && (
            <Stack spacing={0.5} alignItems="center">
              <Typography variant="h3" sx={{ fontSize: 20, fontFamily: 'monospace' }}>
                {view.vehicleNumber}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {view.vehicleTypeLabel}
              </Typography>
            </Stack>
          )}

          {view.tagType === 'emergency' && (
            <Stack spacing={0.5} alignItems="center">
              {view.bloodGroup && (
                <Typography variant="h3" sx={{ fontSize: 20 }}>
                  Blood Group: {view.bloodGroup}
                </Typography>
              )}
              {view.emergencyNote && (
                <Typography variant="body2" color="text.secondary">
                  {view.emergencyNote}
                </Typography>
              )}
            </Stack>
          )}

          {view.tagType === 'business' && (
            <Stack spacing={0.5} alignItems="center">
              <Typography variant="h3" sx={{ fontSize: 20 }}>
                {view.businessName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {view.businessCategory}
              </Typography>
            </Stack>
          )}

          <Divider sx={{ width: '100%', my: 1 }} />
          <Stack direction="row" spacing={0.75} alignItems="center" sx={{ color: 'text.secondary' }}>
            <ShieldRoundedIcon fontSize="small" color="primary" />
            <Typography variant="caption">The owner&apos;s phone number is never shown to you.</Typography>
          </Stack>
        </Card>

        {successNotice && (
          <Alert severity="success" sx={{ mt: 2 }} onClose={() => setSuccessNotice(null)}>
            {successNotice}
          </Alert>
        )}

        <Stack spacing={1.5} sx={{ mt: 3 }}>
          <Button
            size="large"
            variant="contained"
            startIcon={<PhoneRoundedIcon />}
            onClick={handleCallOwner}
            disabled={submitting}
          >
            Call Owner
          </Button>
          <Button
            size="large"
            variant="outlined"
            startIcon={<ChatBubbleRoundedIcon />}
            onClick={() => setDialogMode('message')}
          >
            Send Message
          </Button>

          {view.tagType === 'vehicle' && (
            <Button
              size="large"
              variant="outlined"
              color="warning"
              startIcon={<DirectionsCarFilledRoundedIcon />}
              onClick={() => setDialogMode('wrong_parking')}
            >
              Vehicle Blocking My Way
            </Button>
          )}

          <Button
            size="large"
            variant="outlined"
            color="error"
            startIcon={view.tagType === 'emergency' ? <LocalHospitalRoundedIcon /> : <WarningAmberRoundedIcon />}
            onClick={() => setDialogMode('emergency')}
          >
            Report Emergency
          </Button>
        </Stack>
      </Box>

      <Dialog open={dialogMode !== null} onClose={closeDialog} fullWidth maxWidth="xs">
        <DialogTitle>
          {dialogMode === 'emergency'
            ? 'Report an emergency'
            : dialogMode === 'wrong_parking'
              ? 'Vehicle blocking your way'
              : 'Send a message'}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Your name (optional)"
              value={callerName}
              onChange={(e) => setCallerName(e.target.value)}
              fullWidth
            />
            <TextField
              label="Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={
                dialogMode === 'emergency'
                  ? 'Describe the situation briefly...'
                  : dialogMode === 'wrong_parking'
                    ? 'e.g. Please move your vehicle, it is blocking the gate.'
                    : 'Type your message...'
              }
              multiline
              minRows={3}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmitDialog} disabled={submitting}>
            Send
          </Button>
        </DialogActions>
      </Dialog>
    </ScreenContainer>
  );
}
