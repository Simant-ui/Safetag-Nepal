import { Conversation } from './models/Conversation';
import { QrTag } from './models/QrTag';
import { HttpError } from './apiError';

export async function requireOwnedConversation(conversationId: string, userId: string) {
  const conversation = await Conversation.findById(conversationId);
  if (!conversation) throw new HttpError(404, 'Conversation not found.');
  const tag = await QrTag.findById(conversation.qrId);
  if (!tag || String(tag.ownerId) !== userId) throw new HttpError(403, 'Not authorized.');
  return { conversation, tag };
}
