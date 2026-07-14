'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import ShareRoundedIcon from '@mui/icons-material/ShareRounded';
import PrintRoundedIcon from '@mui/icons-material/PrintRounded';
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded';
import { QrStickerCard } from '@/components/qr/QrStickerCard';
import { useAuthStore } from '@/store/authStore';
import { useQrStore } from '@/store/qrStore';
import { qrService } from '@/services';
import { getQrTagTypeMeta } from '@/constants/qrTagTypes';
import { buildQrUrl } from '@/constants/appConfig';
import type { ScanHistoryEntry } from '@/services/qr/qrTypes';
import { formatDateTime } from '@/utils/formatters';

export default function QrPreviewPage() {
  const router = useRouter();
  const params = useParams<{ qrId: string }>();
  const qrId = params.qrId;
  const user = useAuthStore((s) => s.user);
  const tags = useQrStore((s) => s.tags);
  const fetchTags = useQrStore((s) => s.fetchTags);
  const tag = tags.find((t) => t.qrId === qrId);

  const [history, setHistory] = React.useState<ScanHistoryEntry[]>([]);
  const [showHistory, setShowHistory] = React.useState(false);

  React.useEffect(() => {
    qrService.getScanHistory(qrId).then(setHistory).catch(() => {});
  }, [qrId]);

  React.useEffect(() => {
    if (!tag && user) fetchTags(user.userId);
  }, [tag, user, fetchTags]);

  const qrUrl = buildQrUrl(qrId);

  const handleDownload = () => {
    const canvas = document.getElementById('qr-canvas') as HTMLCanvasElement | null;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `safetag-${qrId}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: 'SafeTag Nepal QR', url: qrUrl }).catch(() => {});
    } else {
      await navigator.clipboard.writeText(qrUrl);
      alert('Link copied to clipboard!');
    }
  };

  if (!tag) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  const meta = getQrTagTypeMeta(tag.type);

  return (
    <Box sx={{ px: 2, py: 3 }}>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }} className="no-print">
        <IconButton onClick={() => router.push('/qr')} aria-label="Back to my QR tags">
          <ArrowBackRoundedIcon />
        </IconButton>
        <Typography variant="h2" sx={{ fontSize: 22 }}>
          QR Preview
        </Typography>
      </Stack>

      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, py: 2 }} id="print-area">
        <Chip label={meta.label} color="primary" variant="outlined" className="no-print" />
        <QrStickerCard
          qrUrl={qrUrl}
          qrId={qrId}
          tag={tag}
          ownerName={tag.label || user?.name?.split(' ')[0] || 'SafeTag User'}
        />
        <Typography variant="caption" color="text.secondary" sx={{ wordBreak: 'break-all', textAlign: 'center' }} className="no-print">
          {qrUrl}
        </Typography>
      </Box>

      <Stack direction="row" spacing={1.5} sx={{ mt: 3 }} className="no-print">
        <Button fullWidth variant="outlined" startIcon={<DownloadRoundedIcon />} onClick={handleDownload}>
          Download
        </Button>
        <Button fullWidth variant="outlined" startIcon={<ShareRoundedIcon />} onClick={handleShare}>
          Share
        </Button>
        <Button fullWidth variant="outlined" startIcon={<PrintRoundedIcon />} onClick={() => window.print()}>
          Print
        </Button>
      </Stack>

      <Button
        fullWidth
        sx={{ mt: 2 }}
        className="no-print"
        startIcon={<HistoryRoundedIcon />}
        onClick={() => setShowHistory((v) => !v)}
      >
        {showHistory ? 'Hide' : 'View'} scan history ({tag.scanCount})
      </Button>

      {showHistory && (
        <Stack spacing={1} sx={{ mt: 1.5 }} className="no-print">
          {history.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
              No scans yet.
            </Typography>
          ) : (
            history.map((h, i) => (
              <Typography key={i} variant="body2" color="text.secondary">
                Scanned {formatDateTime(h.scannedAt)}
              </Typography>
            ))
          )}
        </Stack>
      )}
    </Box>
  );
}
