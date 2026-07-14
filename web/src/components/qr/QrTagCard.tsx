'use client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import type { QrTag } from '@/types/models';
import { getQrTagTypeMeta } from '@/constants/qrTagTypes';
import { formatDate } from '@/utils/formatters';

interface QrTagCardProps {
  tag: QrTag;
  onOpen: () => void;
  onToggleStatus: (active: boolean) => void;
}

export function QrTagCard({ tag, onOpen, onToggleStatus }: QrTagCardProps) {
  const meta = getQrTagTypeMeta(tag.type);

  return (
    <Card variant="outlined">
      <CardActionArea onClick={onOpen} sx={{ p: 2 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Chip size="small" label={meta.label} color="primary" variant="outlined" sx={{ mb: 1 }} />
            <Typography variant="subtitle1">{tag.label || meta.label}</Typography>
            <Typography variant="caption" color="text.secondary">
              Created {formatDate(tag.createdAt)}
            </Typography>
            <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mt: 0.5 }}>
              <VisibilityRoundedIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary">
                {tag.scanCount} scans
              </Typography>
            </Stack>
          </Box>
          <Switch
            checked={tag.status === 'active'}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => onToggleStatus(e.target.checked)}
          />
        </Stack>
      </CardActionArea>
    </Card>
  );
}
