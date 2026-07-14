import type { Conversation, Message } from '@/types/models';
import type { SendMessageInput } from './messageTypes';

export interface MessageService {
  listConversations(userId: string): Promise<Conversation[]>;
  listMessages(conversationId: string): Promise<Message[]>;
  sendMessage(input: SendMessageInput): Promise<Message>;
  /** Anonymous scanner starts a conversation tied to a QR tag, without any account. */
  startConversationFromScan(qrId: string, firstMessage: string): Promise<Conversation>;
  markConversationRead(conversationId: string): Promise<void>;
}
