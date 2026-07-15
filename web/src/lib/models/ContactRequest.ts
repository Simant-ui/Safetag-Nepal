import { Schema, model, models, Model, Types } from 'mongoose';
import { idTransformOptions } from '../schemaOptions';

export type ContactRequestType = 'call' | 'message' | 'emergency' | 'wrong_parking';
export type ContactRequestStatus = 'pending' | 'acknowledged' | 'closed';

export interface ContactRequestDoc {
  qrId: Types.ObjectId;
  callerInfo?: { name?: string; phone?: string };
  message?: string;
  requestType: ContactRequestType;
  status: ContactRequestStatus;
}

const contactRequestSchema = new Schema<ContactRequestDoc>(
  {
    qrId: { type: Schema.Types.ObjectId, ref: 'QrTag', required: true, index: true },
    callerInfo: { name: String, phone: String, _id: false },
    message: String,
    requestType: { type: String, enum: ['call', 'message', 'emergency', 'wrong_parking'], required: true },
    status: { type: String, enum: ['pending', 'acknowledged', 'closed'], default: 'pending' },
  },
  idTransformOptions('requestId', ['qrId']),
);

export const ContactRequest = (models.ContactRequest as Model<ContactRequestDoc>) ?? model<ContactRequestDoc>('ContactRequest', contactRequestSchema);
