'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import { Html5Qrcode } from 'html5-qrcode';

interface QrScannerProps {
  onResult: (decodedText: string) => void;
}

const ELEMENT_ID = 'safetag-qr-scanner';

export function QrScanner({ onResult }: QrScannerProps) {
  const [error, setError] = React.useState<string | null>(null);
  const scannerRef = React.useRef<Html5Qrcode | null>(null);
  const hasResolvedRef = React.useRef(false);

  React.useEffect(() => {
    const scanner = new Html5Qrcode(ELEMENT_ID);
    scannerRef.current = scanner;

    scanner
      .start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 240, height: 240 } },
        (decodedText) => {
          if (hasResolvedRef.current) return;
          hasResolvedRef.current = true;
          onResult(decodedText);
        },
        () => {
          // per-frame decode failures are expected while aiming — ignore
        },
      )
      .catch(() => {
        setError('Could not access the camera. Please allow camera permission and reload.');
      });

    return () => {
      scanner.stop().catch(() => {});
      scanner.clear();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Box
        id={ELEMENT_ID}
        sx={{
          width: '100%',
          borderRadius: 3,
          overflow: 'hidden',
          bgcolor: 'black',
          '& video': { width: '100%' },
        }}
      />
    </Box>
  );
}
