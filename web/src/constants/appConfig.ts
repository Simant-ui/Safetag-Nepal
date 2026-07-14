export const APP_NAME = 'SafeTag Nepal';
export const SUPPORT_EMAIL = 'support@safetag.np';
export const SUPPORT_PHONE = '+977-9824718666';

export const USE_MOCK_API = process.env.NEXT_PUBLIC_USE_MOCK_API !== 'false';
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'https://api.safetag.np/v1';
export const QR_PUBLIC_BASE_URL = process.env.NEXT_PUBLIC_QR_BASE_URL ?? 'http://localhost:3000/q';

export const buildQrUrl = (qrId: string) => `${QR_PUBLIC_BASE_URL}/${qrId}`;
