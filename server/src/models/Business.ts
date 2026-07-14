import { Schema, model, Types } from 'mongoose';
import { idTransformOptions } from '../utils/schemaOptions';

export interface SocialLink {
  platform: string;
  url: string;
}

export interface BusinessDoc {
  userId: Types.ObjectId;
  qrId: Types.ObjectId;
  name: string;
  category: string;
  description?: string;
  phone?: string;
  website?: string;
  location?: string;
  socialLinks?: SocialLink[];
  services?: string[];
}

const businessSchema = new Schema<BusinessDoc>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    qrId: { type: Schema.Types.ObjectId, ref: 'QrTag', required: true, unique: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    description: String,
    phone: String,
    website: String,
    location: String,
    socialLinks: [{ platform: String, url: String, _id: false }],
    services: [String],
  },
  idTransformOptions('businessId', ['userId', 'qrId']),
);

export const Business = model<BusinessDoc>('Business', businessSchema);
