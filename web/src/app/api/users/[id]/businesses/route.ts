import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Business } from '@/lib/models/Business';
import { QrTag } from '@/lib/models/QrTag';
import { handleRouteError, jsonError } from '@/lib/apiError';
import { requireAuth } from '@/lib/auth';
import { registerBusinessSchema } from '@/lib/zodSchemas';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = requireAuth(req);
    if (!auth || params.id !== auth.userId) return jsonError(403, 'Not authorized.');

    await connectDB();
    const businesses = await Business.find({ userId: params.id }).sort({ createdAt: -1 });
    return NextResponse.json(businesses.map((b) => b.toJSON()));
  } catch (err) {
    return handleRouteError(err);
  }
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = requireAuth(req);
    if (!auth || params.id !== auth.userId) return jsonError(403, 'Not authorized.');

    await connectDB();
    const input = registerBusinessSchema.parse(await req.json());

    const qrTag = await QrTag.create({ ownerId: params.id, type: 'business', label: input.name });
    const business = await Business.create({ userId: params.id, qrId: qrTag._id, ...input });

    return NextResponse.json({ business: business.toJSON(), qrTag: qrTag.toJSON() }, { status: 201 });
  } catch (err) {
    return handleRouteError(err);
  }
}
