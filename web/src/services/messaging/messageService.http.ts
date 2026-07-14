import { apiClient } from '@/services/api/client';
import type { Conversation, Message } from '@/types/models';
import type { MessageService } from './messageService';
import type { SendMessageInput } from './messageTypes';

export class HttpMessageService implements MessageService {
  async listConversations(userId: string): Promise<Conversation[]> {
    return apiClient.get<Conversation[]>(`/users/${userId}/conversations`);
  }

  async listMessages(conversationId: string): Promise<Message[]> {
    return apiClient.get<Message[]>(`/conversations/${conversationId}/messages`);
  }

  async sendMessage(input: SendMessageInput): Promise<Message> {
    return apiClient.post<Message>(`/conversations/${input.conversationId}/messages`, input);
  }

  async startConversationFromScan(qrId: string, firstMessage: string): Promise<Conversation> {
    return apiClient.post<Conversation>(`/public/qr/${qrId}/conversations`, { message: firstMessage });
  }

  async markConversationRead(conversationId: string): Promise<void> {
    await apiClient.patch(`/conversations/${conversationId}/read`);
  }
}
