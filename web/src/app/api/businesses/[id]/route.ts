import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Business } from '@/lib/models/Business';
import { handleRouteError, HttpError, jsonError } from '@/lib/apiError';
import { requireAuth } from '@/lib/auth';
import { registerBusinessSchema } from '@/lib/zodSchemas';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = requireAuth(req);
    if (!auth) return jsonError(401, 'Authentication required.');

    await connectDB();
    const input = registerBusinessSchema.partial().parse(await req.json());
    const business = await Business.findById(params.id);
    if (!business) throw new HttpError(404, 'Business not found.');
    if (String(business.userId) !== auth.userId) throw new HttpError(403, 'Not authorized.');

    Object.assign(business, input);
    await business.save();
    return NextResponse.json(business.toJSON());
  } catch (err) {
    return handleRouteError(err);
  }
}
