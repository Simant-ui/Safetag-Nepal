import type { MessageKind } from '@/types/models';

export interface SendMessageInput {
  conversationId: string;
  kind: MessageKind;
  body: string;
  voiceUri?: string;
  voiceDurationSec?: number;
}
