import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { handleRouteError } from '@/lib/apiError';
import { buildPublicOwnerView } from '@/lib/publicOwnerView';

export async function GET(_req: NextRequest, { params }: { params: { qrId: string } }) {
  try {
    await connectDB();
    const view = await buildPublicOwnerView(params.qrId);
    return NextResponse.json(view);
  } catch (err) {
    return handleRouteError(err);
  }
}
