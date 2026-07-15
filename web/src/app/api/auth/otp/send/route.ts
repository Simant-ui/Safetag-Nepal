import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/lib/models/User';
import { OtpRequest } from '@/lib/models/OtpRequest';
import { handleRouteError, jsonError } from '@/lib/apiError';
import { generateOtpCode } from '@/lib/otp';
import { checkRateLimit } from '@/lib/rateLimit';
import { sendOtpSchema } from '@/lib/zodSchemas';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { phone, intent } = sendOtpSchema.parse(body);

    const ip = req.headers.get('x-forwarded-for') ?? 'unknown';
    if (!checkRateLimit(`otp:${phone}:${ip}`, 5, 15 * 60 * 1000)) {
      return jsonError(429, 'Too many OTP requests. Please try again later.');
    }

    const existing = await User.findOne({ phone });
    const isRegistered = !!existing && existing.name !== 'New User';

    if (intent === 'login' && !isRegistered) {
      return jsonError(404, 'This number is not registered. Please sign up first.');
    }
    if (intent === 'signup' && isRegistered) {
      return jsonError(409, 'This number is already registered. Please log in instead.');
    }

    const code = generateOtpCode(phone);
    const otpRequest = await OtpRequest.create({ phone, code });

    return NextResponse.json({
      requestId: String(otpRequest._id),
      devCode: process.env.NODE_ENV === 'production' ? undefined : code,
    });
  } catch (err) {
    return handleRouteError(err);
  }
}
