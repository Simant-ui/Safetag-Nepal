import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Conversation } from '@/lib/models/Conversation';
import { Message } from '@/lib/models/Message';
import { QrTag } from '@/lib/models/QrTag';
import { handleRouteError, HttpError } from '@/lib/apiError';
import { assertOwnerSubscriptionActive } from '@/lib/subscriptionGuard';
import { notifyOwner } from '@/lib/notify';
import { startConversationSchema } from '@/lib/zodSchemas';

export async function POST(req: NextRequest, { params }: { params: { qrId: string } }) {
  try {
    await connectDB();
    const tag = await QrTag.findById(params.qrId);
    if (!tag) throw new HttpError(404, 'QR tag not found.');
    await assertOwnerSubscriptionActive(tag.ownerId);

    const { message: firstMessage } = startConversationSchema.parse(await req.json());

    let conversation = await Conversation.findOne({ qrId: tag._id });
    if (!conversation) {
      conversation = await Conversation.create({ qrId: tag._id, qrLabel: tag.label ?? 'SafeTag', unreadCount: 0 });
    }

    await Message.create({ conversationId: conversation._id, kind: 'text', body: firstMessage, fromOwner: false });
    conversation.lastMessage = firstMessage;
    conversation.lastMessageAt = new Date();
    conversation.unreadCount += 1;
    await conversation.save();

    await notifyOwner({
      userId: tag.ownerId,
      category: 'message',
      title: 'New message',
      body: 'Someone contacted you regarding your QR tag.',
      relatedQrId: tag._id,
      relatedConversationId: conversation._id,
    });

    return NextResponse.json(conversation.toJSON(), { status: 201 });
  } catch (err) {
    return handleRouteError(err);
  }
}
