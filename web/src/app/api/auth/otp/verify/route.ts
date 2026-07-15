import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/lib/models/User';
import { OtpRequest } from '@/lib/models/OtpRequest';
import { handleRouteError, HttpError } from '@/lib/apiError';
import { signToken } from '@/lib/auth';
import { verifyOtpSchema } from '@/lib/zodSchemas';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { requestId, code } = verifyOtpSchema.parse(body);

    const otpRequest = await OtpRequest.findById(requestId);
    if (!otpRequest || otpRequest.used) {
      throw new HttpError(400, 'This OTP request has expired. Please request a new code.');
    }
    if (otpRequest.code !== code) {
      throw new HttpError(400, 'Incorrect code. Please try again.');
    }
    otpRequest.used = true;
    await otpRequest.save();

    let user = await User.findOne({ phone: otpRequest.phone });
    if (!user) {
      user = await User.create({ phone: otpRequest.phone, name: 'New User', role: 'normal' });
    }

    const token = signToken({ userId: String(user._id) });
    return NextResponse.json({ user: user.toJSON(), token });
  } catch (err) {
    return handleRouteError(err);
  }
}
