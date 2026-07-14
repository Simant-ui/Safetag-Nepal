import { Schema, model, Types } from 'mongoose';
import { idTransformOptions } from '../utils/schemaOptions';

export type NotificationCategory = 'contact_request' | 'emergency' | 'wrong_parking' | 'message' | 'system';

export interface NotificationDoc {
  userId: Types.ObjectId;
  category: NotificationCategory;
  title: string;
  body: string;
  read: boolean;
  relatedQrId?: Types.ObjectId;
  relatedConversationId?: Types.ObjectId;
}

const notificationSchema = new Schema<NotificationDoc>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    category: {
      type: String,
      enum: ['contact_request', 'emergency', 'wrong_parking', 'message', 'system'],
      required: true,
    },
    title: { type: String, required: true },
    body: { type: String, required: true },
    read: { type: Boolean, default: false },
    relatedQrId: { type: Schema.Types.ObjectId, ref: 'QrTag' },
    relatedConversationId: { type: Schema.Types.ObjectId, ref: 'Conversation' },
  },
  idTransformOptions('notificationId', ['userId', 'relatedQrId', 'relatedConversationId']),
);

export const Notification = model<NotificationDoc>('Notification', notificationSchema);
