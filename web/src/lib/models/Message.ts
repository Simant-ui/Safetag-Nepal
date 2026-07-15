import { Schema, model, models, Model, Types } from 'mongoose';
import { idTransformOptions } from '../schemaOptions';

export type MessageKind = 'text' | 'voice';

export interface MessageDoc {
  conversationId: Types.ObjectId;
  kind: MessageKind;
  body: string;
  fromOwner: boolean;
  voiceUri?: string;
  voiceDurationSec?: number;
}

const messageSchema = new Schema<MessageDoc>(
  {
    conversationId: { type: Schema.Types.ObjectId, ref: 'Conversation', required: true, index: true },
    kind: { type: String, enum: ['text', 'voice'], default: 'text' },
    body: { type: String, required: true },
    fromOwner: { type: Boolean, required: true },
    voiceUri: String,
    voiceDurationSec: Number,
  },
  idTransformOptions('messageId', ['conversationId']),
);

export const Message = (models.Message as Model<MessageDoc>) ?? model<MessageDoc>('Message', messageSchema);
