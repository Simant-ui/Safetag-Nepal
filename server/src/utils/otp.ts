/**
 * No SMS gateway account exists yet, so the OTP is deterministic — the last 4 digits of the
 * phone number itself — rather than a real random code sent by SMS. This is dev-only: it's
 * fine because there's no real security boundary here yet (no SMS delivery to protect), and
 * it's easy for testers to derive without needing a devCode echoed back. Swap this for a real
 * provider (e.g. Sparrow SMS for Nepal) once env.smsGatewayApiKey is set — the OtpRequest
 * model/flow around this doesn't need to change, only this function's body.
 */
export function generateOtpCode(phone: string): string {
  return phone.slice(-4);
}
