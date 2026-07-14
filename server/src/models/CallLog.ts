import { Schema, model, Types } from 'mongoose';
import { idTransformOptions } from '../utils/schemaOptions';

export interface CallLogDoc {
  qrId: Types.ObjectId;
  visitorIp?: string;
  userAgent?: string;
  browserName?: string;
  deviceType?: string;
}

const callLogSchema = new Schema<CallLogDoc>(
  {
    qrId: { type: Schema.Types.ObjectId, ref: 'QrTag', required: true, index: true },
    visitorIp: String,
    userAgent: String,
    browserName: String,
    deviceType: String,
  },
  idTransformOptions('callLogId', ['qrId']),
);

export const CallLog = model<CallLogDoc>('CallLog', callLogSchema);
