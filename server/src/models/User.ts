import { Schema, model } from 'mongoose';
import { idTransformOptions } from '../utils/schemaOptions';

export type UserRole = 'normal' | 'vehicle_owner' | 'business' | 'admin';

export interface UserDoc {
  name: string;
  phone: string;
  email?: string;
  profileImage?: string;
  role: UserRole;
  emergencyContact?: string;
  bloodGroup?: string;
  address?: string;
}

const userSchema = new Schema<UserDoc>(
  {
    name: { type: String, required: true, default: 'New User' },
    phone: { type: String, required: true, unique: true, index: true },
    email: String,
    profileImage: String,
    role: { type: String, enum: ['normal', 'vehicle_owner', 'business', 'admin'], default: 'normal' },
    emergencyContact: String,
    bloodGroup: String,
    address: String,
  },
  idTransformOptions('userId'),
);

export const User = model<UserDoc>('User', userSchema);
