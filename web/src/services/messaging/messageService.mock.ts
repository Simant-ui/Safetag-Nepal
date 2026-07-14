import type { Conversation, Message } from '@/types/models';
import { mockDb, simulateLatency } from '@/services/mockDb/db';
import { BrowserNotificationService } from '@/services/notifications/notificationService.browser';
import type { MessageService } from './messageService';
import type { SendMessageInput } from './messageTypes';

const notificationService = new BrowserNotificationService();

export class MockMessageService implements MessageService {
  async listConversations(userId: string): Promise<Conversation[]> {
    await simulateLatency(100);
    const myQrIds = new Set(mockDb.qrTags.filter((t) => t.ownerId === userId).map((t) => t.qrId));
    return mockDb.conversations.filter((c) => myQrIds.has(c.qrId));
  }

  async listMessages(conversationId: string): Promise<Message[]> {
    await simulateLatency(80);
    return mockDb.messages
      .filter((m) => m.conversationId === conversationId)
      .sort((a, b) => (a.createdAt < b.createdAt ? -1 : 1));
  }

  async sendMessage(input: SendMessageInput): Promise<Message> {
    await simulateLatency(100);
    const conversation = mockDb.conversations.find((c) => c.conversationId === input.conversationId);
    if (!conversation) throw new Error('Conversation not found.');

    const message: Message = {
      messageId: mockDb.genId('msg'),
      conversationId: input.conversationId,
      kind: input.kind,
      body: input.body,
      fromOwner: true,
      createdAt: new Date().toISOString(),
      voiceUri: input.voiceUri,
      voiceDurationSec: input.voiceDurationSec,
    };
    mockDb.messages.push(message);
    conversation.lastMessage = input.kind === 'voice' ? '🎤 Voice message' : input.body;
    conversation.lastMessageAt = message.createdAt;
    return message;
  }

  async startConversationFromScan(qrId: string, firstMessage: string): Promise<Conversation> {
    await simulateLatency(120);
    const tag = mockDb.qrTags.find((t) => t.qrId === qrId);
    if (!tag) throw new Error('QR tag not found.');

    let conversation = mockDb.conversations.find((c) => c.qrId === qrId);
    if (!conversation) {
      conversation = {
        conversationId: mockDb.genId('conv'),
        qrId,
        qrLabel: tag.label ?? 'SafeTag',
        unreadCount: 0,
      };
      mockDb.conversations.push(conversation);
    }

    const message: Message = {
      messageId: mockDb.genId('msg'),
      conversationId: conversation.conversationId,
      kind: 'text',
      body: firstMessage,
      fromOwner: false,
      createdAt: new Date().toISOString(),
    };
    mockDb.messages.push(message);
    conversation.lastMessage = firstMessage;
    conversation.lastMessageAt = message.createdAt;
    conversation.unreadCount += 1;

    await notificationService.notify(tag.ownerId, {
      category: 'message',
      title: 'New message',
      body: 'Someone contacted you regarding your QR tag.',
      relatedQrId: qrId,
      relatedConversationId: conversation.conversationId,
    });

    return conversation;
  }

  async markConversationRead(conversationId: string): Promise<void> {
    const conversation = mockDb.conversations.find((c) => c.conversationId === conversationId);
    if (conversation) conversation.unreadCount = 0;
  }
}
