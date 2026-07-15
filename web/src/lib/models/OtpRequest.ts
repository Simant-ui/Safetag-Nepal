import { Schema, model, models, Model } from 'mongoose';

export interface OtpRequestDoc {
  phone: string;
  code: string;
  used: boolean;
  createdAt: Date;
}

const otpRequestSchema = new Schema<OtpRequestDoc>({
  phone: { type: String, required: true },
  code: { type: String, required: true },
  used: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now, expires: 300 }, // TTL: auto-delete after 5 minutes
});

export const OtpRequest = (models.OtpRequest as Model<OtpRequestDoc>) ?? model<OtpRequestDoc>('OtpRequest', otpRequestSchema);
