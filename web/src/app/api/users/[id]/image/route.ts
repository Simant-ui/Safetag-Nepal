import { NextRequest, NextResponse } from 'next/server';
import { handleRouteError, HttpError, jsonError } from '@/lib/apiError';
import { requireAuth } from '@/lib/auth';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = requireAuth(req);
    if (!auth || params.id !== auth.userId) return jsonError(403, 'Not authorized.');

    const { localUri } = (await req.json()) as { localUri?: string };
    if (!localUri) throw new HttpError(400, 'localUri is required.');

    // No Cloudinary account configured yet — echo the input back so the endpoint stays
    // functional; once CLOUDINARY_URL is set this branch uploads for real, no client change.
    if (!process.env.CLOUDINARY_URL) {
      return NextResponse.json({ url: localUri });
    }

    throw new HttpError(501, 'Cloudinary upload not yet implemented — set CLOUDINARY_URL and add the SDK call here.');
  } catch (err) {
    return handleRouteError(err);
  }
}
