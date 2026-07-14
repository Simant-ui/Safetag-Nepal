import type { ContactRequestType } from '@/types/models';

export interface SendContactRequestInput {
  qrId: string;
  requestType: ContactRequestType;
  message?: string;
  callerInfo?: { name?: string; phone?: string };
}

export interface CallBridgeResult {
  /** Opaque id for the masked call session — a real deployment maps this to a Twilio/Exotel bridge. */
  maskedCallId: string;
  /** A virtual/proxy number the scanner's phone dialer should call, once telecom integration exists. */
  dialNumber?: string;
}
