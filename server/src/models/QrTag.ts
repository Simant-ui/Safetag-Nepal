import { Schema, model, Types } from 'mongoose';
import { idTransformOptions } from '../utils/schemaOptions';

export type QrTagType = 'vehicle' | 'emergency' | 'personal' | 'business';
export type QrTagStatus = 'active' | 'inactive';

export interface QrTagDoc {
  ownerId: Types.ObjectId;
  type: QrTagType;
  status: QrTagStatus;
  label?: string;
  scanCount: number;
  lastScannedAt?: Date;
}

const qrTagSchema = new Schema<QrTagDoc>(
  {
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: { type: String, enum: ['vehicle', 'emergency', 'personal', 'business'], required: true },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    label: String,
    scanCount: { type: Number, default: 0 },
    lastScannedAt: Date,
  },
  idTransformOptions('qrId', ['ownerId']),
);

export const QrTag = model<QrTagDoc>('QrTag', qrTagSchema);
