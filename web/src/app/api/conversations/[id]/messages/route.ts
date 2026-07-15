import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Message } from '@/lib/models/Message';
import { handleRouteError, jsonError } from '@/lib/apiError';
import { requireAuth } from '@/lib/auth';
import { requireOwnedConversation } from '@/lib/requireOwnedConversation';
import { sendMessageSchema } from '@/lib/zodSchemas';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = requireAuth(req);
    if (!auth) return jsonError(401, 'Authentication required.');

    await connectDB();
    await requireOwnedConversation(params.id, auth.userId);
    const messages = await Message.find({ conversationId: params.id }).sort({ createdAt: 1 });
    return NextResponse.json(messages.map((m) => m.toJSON()));
  } catch (err) {
    return handleRouteError(err);
  }
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = requireAuth(req);
    if (!auth) return jsonError(401, 'Authentication required.');

    await connectDB();
    const { conversation } = await requireOwnedConversation(params.id, auth.userId);
    const input = sendMessageSchema.parse(await req.json());

    const message = await Message.create({ conversationId: conversation._id, fromOwner: true, ...input });
    conversation.lastMessage = input.kind === 'voice' ? '🎤 Voice message' : input.body;
    conversation.lastMessageAt = new Date();
    await conversation.save();

    return NextResponse.json(message.toJSON(), { status: 201 });
  } catch (err) {
    return handleRouteError(err);
  }
}
