import { NextRequest, NextResponse } from 'next/server';
import { handleRouteError, HttpError } from '@/lib/apiError';
import { signAdminToken } from '@/lib/auth';
import { checkRateLimit } from '@/lib/rateLimit';
import { adminLoginSchema } from '@/lib/zodSchemas';

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') ?? 'unknown';
    if (!checkRateLimit(`admin-login:${ip}`, 5, 15 * 60 * 1000)) {
      throw new HttpError(429, 'Too many login attempts. Please try again later.');
    }

    const { username, password } = adminLoginSchema.parse(await req.json());
    if (username !== process.env.ADMIN_USERNAME || password !== process.env.ADMIN_PASSWORD) {
      throw new HttpError(401, 'Invalid admin credentials.');
    }
    return NextResponse.json({ token: signAdminToken() });
  } catch (err) {
    return handleRouteError(err);
  }
}
