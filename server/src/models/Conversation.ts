import { Schema, model, Types } from 'mongoose';
import { idTransformOptions } from '../utils/schemaOptions';

export interface ConversationDoc {
  qrId: Types.ObjectId;
  qrLabel: string;
  lastMessage?: string;
  lastMessageAt?: Date;
  unreadCount: number;
}

const conversationSchema = new Schema<ConversationDoc>(
  {
    qrId: { type: Schema.Types.ObjectId, ref: 'QrTag', required: true, index: true },
    qrLabel: { type: String, required: true },
    lastMessage: String,
    lastMessageAt: Date,
    unreadCount: { type: Number, default: 0 },
  },
  idTransformOptions('conversationId', ['qrId']),
);

export const Conversation = model<ConversationDoc>('Conversation', conversationSchema);
