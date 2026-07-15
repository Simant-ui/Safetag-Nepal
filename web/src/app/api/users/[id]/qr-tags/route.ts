import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { QrTag } from '@/lib/models/QrTag';
import { handleRouteError, jsonError } from '@/lib/apiError';
import { requireAuth } from '@/lib/auth';
import { createQrTagSchema } from '@/lib/zodSchemas';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = requireAuth(req);
    if (!auth || params.id !== auth.userId) return jsonError(403, 'Not authorized.');

    await connectDB();
    const tags = await QrTag.find({ ownerId: params.id }).sort({ createdAt: -1 });
    return NextResponse.json(tags.map((t) => t.toJSON()));
  } catch (err) {
    return handleRouteError(err);
  }
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = requireAuth(req);
    if (!auth || params.id !== auth.userId) return jsonError(403, 'Not authorized.');

    await connectDB();
    const input = createQrTagSchema.parse(await req.json());
    const tag = await QrTag.create({ ownerId: params.id, type: input.type, label: input.label });
    return NextResponse.json(tag.toJSON(), { status: 201 });
  } catch (err) {
    return handleRouteError(err);
  }
}
