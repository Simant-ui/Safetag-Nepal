import type { Request, Response } from 'express';
import { Conversation } from '../models/Conversation';
import { Message } from '../models/Message';
import { QrTag } from '../models/QrTag';
import { asyncHandler, HttpError } from '../utils/asyncHandler';
import { notifyOwner } from '../utils/notify';
import { assertOwnerSubscriptionActive } from '../utils/subscriptionGuard';
import { sendMessageSchema, startConversationSchema } from '../utils/zodSchemas';

export const listConversations = asyncHandler(async (req: Request, res: Response) => {
  if (req.params.id !== req.userId) throw new HttpError(403, 'Not authorized.');
  const myTagIds = (await QrTag.find({ ownerId: req.params.id }).select('_id')).map((t) => t._id);
  const conversations = await Conversation.find({ qrId: { $in: myTagIds } }).sort({ lastMessageAt: -1 });
  res.json(conversations.map((c) => c.toJSON()));
});

async function requireOwnedConversation(conversationId: string, userId: string | undefined) {
  const conversation = await Conversation.findById(conversationId);
  if (!conversation) throw new HttpError(404, 'Conversation not found.');
  const tag = await QrTag.findById(conversation.qrId);
  if (!tag || String(tag.ownerId) !== userId) throw new HttpError(403, 'Not authorized.');
  return { conversation, tag };
}

export const listMessages = asyncHandler(async (req: Request, res: Response) => {
  await requireOwnedConversation(req.params.id, req.userId);
  const messages = await Message.find({ conversationId: req.params.id }).sort({ createdAt: 1 });
  res.json(messages.map((m) => m.toJSON()));
});

export const sendMessage = asyncHandler(async (req: Request, res: Response) => {
  const { conversation } = await requireOwnedConversation(req.params.id, req.userId);
  const input = sendMessageSchema.parse(req.body);

  const message = await Message.create({ conversationId: conversation._id, fromOwner: true, ...input });
  conversation.lastMessage = input.kind === 'voice' ? '🎤 Voice message' : input.body;
  conversation.lastMessageAt = new Date();
  await conversation.save();

  res.status(201).json(message.toJSON());
});

export const startConversationFromScan = asyncHandler(async (req: Request, res: Response) => {
  const tag = await QrTag.findById(req.params.qrId);
  if (!tag) throw new HttpError(404, 'QR tag not found.');
  await assertOwnerSubscriptionActive(tag.ownerId);
  const { message: firstMessage } = startConversationSchema.parse(req.body);

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

  res.status(201).json(conversation.toJSON());
});

export const markConversationRead = asyncHandler(async (req: Request, res: Response) => {
  const { conversation } = await requireOwnedConversation(req.params.id, req.userId);
  conversation.unreadCount = 0;
  await conversation.save();
  res.status(204).end();
});
