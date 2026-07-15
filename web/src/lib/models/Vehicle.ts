import { Schema, model, models, Model, Types } from 'mongoose';
import { idTransformOptions } from '../schemaOptions';

export type VehicleType = 'car' | 'bike' | 'scooter' | 'truck' | 'other';

export interface VehicleDoc {
  userId: Types.ObjectId;
  vehicleNumber: string;
  vehicleType: VehicleType;
  brand?: string;
  model?: string;
  color?: string;
  year?: number;
  image?: string;
  qrId: Types.ObjectId;
}

const vehicleSchema = new Schema<VehicleDoc>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    vehicleNumber: { type: String, required: true },
    vehicleType: { type: String, enum: ['car', 'bike', 'scooter', 'truck', 'other'], required: true },
    brand: String,
    model: String,
    color: String,
    year: Number,
    image: String,
    qrId: { type: Schema.Types.ObjectId, ref: 'QrTag', required: true, unique: true },
  },
  idTransformOptions('vehicleId', ['userId', 'qrId']),
);

export const Vehicle = (models.Vehicle as Model<VehicleDoc>) ?? model<VehicleDoc>('Vehicle', vehicleSchema);
