import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Vehicle } from '@/lib/models/Vehicle';
import { QrTag } from '@/lib/models/QrTag';
import { handleRouteError, jsonError } from '@/lib/apiError';
import { requireAuth } from '@/lib/auth';
import { registerVehicleSchema } from '@/lib/zodSchemas';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = requireAuth(req);
    if (!auth || params.id !== auth.userId) return jsonError(403, 'Not authorized.');

    await connectDB();
    const vehicles = await Vehicle.find({ userId: params.id }).sort({ createdAt: -1 });
    return NextResponse.json(vehicles.map((v) => v.toJSON()));
  } catch (err) {
    return handleRouteError(err);
  }
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = requireAuth(req);
    if (!auth || params.id !== auth.userId) return jsonError(403, 'Not authorized.');

    await connectDB();
    const input = registerVehicleSchema.parse(await req.json());

    const qrTag = await QrTag.create({
      ownerId: params.id,
      type: 'vehicle',
      label: input.qrLabel ?? input.vehicleNumber,
    });

    const vehicle = await Vehicle.create({
      userId: params.id,
      vehicleNumber: input.vehicleNumber,
      vehicleType: input.vehicleType,
      brand: input.brand,
      model: input.model,
      color: input.color,
      year: input.year,
      image: input.image,
      qrId: qrTag._id,
    });

    return NextResponse.json({ vehicle: vehicle.toJSON(), qrTag: qrTag.toJSON() }, { status: 201 });
  } catch (err) {
    return handleRouteError(err);
  }
}
