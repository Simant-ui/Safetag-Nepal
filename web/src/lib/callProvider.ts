export interface CallProviderResult {
  /** Where the browser should be sent to place the call. tel: today, a masked/virtual number
   * flow (Twilio/Exotel/SIP) later — callers of this module never need to change. */
  redirectUrl: string;
}

export interface CallContext {
  qrId: string;
  visitorIp?: string;
}

export interface CallProvider {
  initiateCall(ownerPhone: string, context: CallContext): Promise<CallProviderResult>;
}

/**
 * Current implementation: dials the owner's real number directly via the device's tel: handler.
 * The number is never returned to the frontend as JSON or rendered as page text — it only ever
 * exists in this server-side redirect. Swap this class for TwilioCallProvider / ExotelCallProvider
 * / a SIP gateway later; nothing else in the codebase (controller, route, frontend) needs to change.
 */
class DirectDialCallProvider implements CallProvider {
  async initiateCall(ownerPhone: string, _context: CallContext): Promise<CallProviderResult> {
    const e164 = ownerPhone.startsWith('+') ? ownerPhone : `+977${ownerPhone}`;
    return { redirectUrl: `tel:${e164}` };
  }
}

export const callProvider: CallProvider = new DirectDialCallProvider();
