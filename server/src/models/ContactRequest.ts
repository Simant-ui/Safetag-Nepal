import { Schema, model, Types } from 'mongoose';
import { idTransformOptions } from '../utils/schemaOptions';

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

export const ContactRequest = model<ContactRequestDoc>('ContactRequest', contactRequestSchema);
