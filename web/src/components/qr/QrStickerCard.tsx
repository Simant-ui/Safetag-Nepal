'use client';

import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import PhoneRoundedIcon from '@mui/icons-material/PhoneRounded';
import ChatBubbleRoundedIcon from '@mui/icons-material/ChatBubbleRounded';
import LocalHospitalRoundedIcon from '@mui/icons-material/LocalHospitalRounded';
import DoNotDisturbOnRoundedIcon from '@mui/icons-material/DoNotDisturbOnRounded';
import { QRCodeCanvas } from 'qrcode.react';
import type { QrTag, QrTagType } from '@/types/models';
import { colors } from '@/theme/tokens';

interface QrStickerCardProps {
  qrUrl: string;
  qrId: string;
  tag: QrTag;
  ownerName: string;
}

const HEADLINE: Record<QrTagType, string> = {
  vehicle: 'Scan the code to contact the vehicle owner.',
  emergency: 'Scan the code for emergency medical information.',
  personal: 'Scan the code to contact the owner of this item.',
  business: 'Scan the code to view this business & contact us.',
};

const shortCode = (qrId: string) => qrId.replace(/^qr_/, '').slice(0, 10).toUpperCase();

export function QrStickerCard({ qrUrl, qrId, tag, ownerName }: QrStickerCardProps) {
  return (
    <Box
      className="sticker-print"
      sx={{
        width: '100%',
        maxWidth: 420,
        aspectRatio: '1.75 / 1',
        border: '3px solid',
        borderColor: 'text.primary',
        borderRadius: 3,
        display: 'flex',
        overflow: 'hidden',
        bgcolor: '#FFFFFF',
        color: colors.text.primary,
      }}
    >
      <Stack sx={{ flex: 1.15, p: 2, justifyContent: 'space-between' }}>
        <Box>
          <Typography sx={{ fontWeight: 800, fontSize: 15, letterSpacing: 0.5 }}>
            SafeTag <Box component="span" sx={{ color: colors.brand.primary }}>Nepal</Box>
          </Typography>
          <Typography sx={{ fontSize: 9.5, color: colors.text.secondary, mt: 0.25 }}>
            Smart QR Contact Tag {tag.label ? `— ${tag.label}` : ''}
          </Typography>
        </Box>

        <Typography sx={{ fontWeight: 800, fontSize: 19, lineHeight: 1.15, textDecoration: 'underline', textDecorationThickness: 2 }}>
          {HEADLINE[tag.type]}
        </Typography>

        <Box>
          <Typography sx={{ fontSize: 8.5, color: colors.text.secondary }}>
            SCAN USING PHONE CAMERA, GOOGLE LENS, OR ANY QR SCANNER APP.
          </Typography>
          <Stack direction="row" spacing={1.5} sx={{ mt: 1 }}>
            <IconLabel icon={<LocalHospitalRoundedIcon sx={{ fontSize: 14 }} />} label="Emergency" />
            <IconLabel icon={<DoNotDisturbOnRoundedIcon sx={{ fontSize: 14 }} />} label="Wrong Parking" />
            <IconLabel icon={<ChatBubbleRoundedIcon sx={{ fontSize: 14 }} />} label="Message" />
            <IconLabel icon={<PhoneRoundedIcon sx={{ fontSize: 14 }} />} label="Call" />
          </Stack>
        </Box>
      </Stack>

      <Stack
        sx={{
          flex: 0.85,
          bgcolor: colors.brand.secondaryContainer,
          p: 1.5,
          alignItems: 'center',
          justifyContent: 'center',
          gap: 0.75,
          borderLeft: '3px solid',
          borderColor: 'text.primary',
        }}
      >
        <Box sx={{ bgcolor: '#FFFFFF', p: 1, borderRadius: 1.5 }}>
          <QRCodeCanvas
            id="qr-canvas"
            value={qrUrl}
            size={110}
            fgColor={colors.text.primary}
            bgColor="#FFFFFF"
            level="M"
            marginSize={0}
          />
        </Box>
        <Typography sx={{ fontWeight: 800, fontSize: 11, textAlign: 'center', lineHeight: 1.1 }}>{ownerName}</Typography>
        <Typography sx={{ fontSize: 7.5, letterSpacing: 1, color: colors.text.secondary }}>{shortCode(qrId)}</Typography>
      </Stack>
    </Box>
  );
}

function IconLabel({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <Stack alignItems="center" spacing={0.25} sx={{ color: colors.text.secondary }}>
      {icon}
      <Typography sx={{ fontSize: 6.5, fontWeight: 600, textAlign: 'center' }}>{label}</Typography>
    </Stack>
  );
}
