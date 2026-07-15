import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Vehicle } from '@/lib/models/Vehicle';
import { handleRouteError, HttpError, jsonError } from '@/lib/apiError';
import { requireAuth } from '@/lib/auth';
import { registerVehicleSchema } from '@/lib/zodSchemas';

async function requireOwnedVehicle(vehicleId: string, userId: string) {
  const vehicle = await Vehicle.findById(vehicleId);
  if (!vehicle) throw new HttpError(404, 'Vehicle not found.');
  if (String(vehicle.userId) !== userId) throw new HttpError(403, 'Not authorized.');
  return vehicle;
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = requireAuth(req);
    if (!auth) return jsonError(401, 'Authentication required.');

    await connectDB();
    const input = registerVehicleSchema.partial().parse(await req.json());
    const vehicle = await requireOwnedVehicle(params.id, auth.userId);
    Object.assign(vehicle, input);
    await vehicle.save();
    return NextResponse.json(vehicle.toJSON());
  } catch (err) {
    return handleRouteError(err);
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = requireAuth(req);
    if (!auth) return jsonError(401, 'Authentication required.');

    await connectDB();
    const vehicle = await requireOwnedVehicle(params.id, auth.userId);
    await vehicle.deleteOne();
    return new NextResponse(null, { status: 204 });
  } catch (err) {
    return handleRouteError(err);
  }
}
