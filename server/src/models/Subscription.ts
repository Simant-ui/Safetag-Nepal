import { Schema, model, Types } from 'mongoose';
import { idTransformOptions } from '../utils/schemaOptions';

export type SubscriptionPlan = 'free' | 'premium' | 'business';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'na';

export interface SubscriptionDoc {
  userId: Types.ObjectId;
  plan: SubscriptionPlan;
  startDate: Date;
  endDate?: Date;
  paymentStatus: PaymentStatus;
}

const subscriptionSchema = new Schema<SubscriptionDoc>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    plan: { type: String, enum: ['free', 'premium', 'business'], default: 'free' },
    startDate: { type: Date, default: Date.now },
    endDate: Date,
    paymentStatus: { type: String, enum: ['pending', 'paid', 'failed', 'na'], default: 'na' },
  },
  idTransformOptions('subscriptionId', ['userId']),
);

export const Subscription = model<SubscriptionDoc>('Subscription', subscriptionSchema);
