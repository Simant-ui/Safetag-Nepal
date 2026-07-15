import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { QrTag } from '@/lib/models/QrTag';
import { handleRouteError, HttpError, jsonError } from '@/lib/apiError';
import { requireAuth } from '@/lib/auth';

export async function GET(req: NextRequest, { params }: { params: { qrId: string } }) {
  try {
    const auth = requireAuth(req);
    if (!auth) return jsonError(401, 'Authentication required.');

    await connectDB();
    const tag = await QrTag.findById(params.qrId);
    if (!tag) throw new HttpError(404, 'QR tag not found.');
    if (String(tag.ownerId) !== auth.userId) throw new HttpError(403, 'Not authorized.');

    // Detailed per-scan history isn't persisted separately in this phase — only the aggregate
    // scanCount/lastScannedAt are. Extend with a ScanEvent collection later if per-scan
    // timestamps/geolocation are needed.
    return NextResponse.json(tag.lastScannedAt ? [{ scannedAt: tag.lastScannedAt.toISOString() }] : []);
  } catch (err) {
    return handleRouteError(err);
  }
}
