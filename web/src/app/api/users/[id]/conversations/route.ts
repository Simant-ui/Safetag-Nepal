import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Conversation } from '@/lib/models/Conversation';
import { QrTag } from '@/lib/models/QrTag';
import { handleRouteError, jsonError } from '@/lib/apiError';
import { requireAuth } from '@/lib/auth';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = requireAuth(req);
    if (!auth || params.id !== auth.userId) return jsonError(403, 'Not authorized.');

    await connectDB();
    const myTagIds = (await QrTag.find({ ownerId: params.id }).select('_id')).map((t) => t._id);
    const conversations = await Conversation.find({ qrId: { $in: myTagIds } }).sort({ lastMessageAt: -1 });
    return NextResponse.json(conversations.map((c) => c.toJSON()));
  } catch (err) {
    return handleRouteError(err);
  }
}
