import { Schema, model, models, Model, Types } from 'mongoose';
import { idTransformOptions } from '../schemaOptions';

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

export const CallLog = (models.CallLog as Model<CallLogDoc>) ?? model<CallLogDoc>('CallLog', callLogSchema);
