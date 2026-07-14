import type { Request, Response } from 'express';
import { Vehicle } from '../models/Vehicle';
import { QrTag } from '../models/QrTag';
import { asyncHandler, HttpError } from '../utils/asyncHandler';
import { registerVehicleSchema } from '../utils/zodSchemas';

export const getByUser = asyncHandler(async (req: Request, res: Response) => {
  if (req.params.id !== req.userId) throw new HttpError(403, 'Not authorized.');
  const vehicles = await Vehicle.find({ userId: req.params.id }).sort({ createdAt: -1 });
  res.json(vehicles.map((v) => v.toJSON()));
});

export const registerVehicle = asyncHandler(async (req: Request, res: Response) => {
  if (req.params.id !== req.userId) throw new HttpError(403, 'Not authorized.');
  const input = registerVehicleSchema.parse(req.body);

  const qrTag = await QrTag.create({
    ownerId: req.params.id,
    type: 'vehicle',
    label: input.qrLabel ?? input.vehicleNumber,
  });

  const vehicle = await Vehicle.create({
    userId: req.params.id,
    vehicleNumber: input.vehicleNumber,
    vehicleType: input.vehicleType,
    brand: input.brand,
    model: input.model,
    color: input.color,
    year: input.year,
    image: input.image,
    qrId: qrTag._id,
  });

  res.status(201).json({ vehicle: vehicle.toJSON(), qrTag: qrTag.toJSON() });
});

async function requireOwnedVehicle(vehicleId: string, userId: string | undefined) {
  const vehicle = await Vehicle.findById(vehicleId);
  if (!vehicle) throw new HttpError(404, 'Vehicle not found.');
  if (String(vehicle.userId) !== userId) throw new HttpError(403, 'Not authorized.');
  return vehicle;
}

export const updateVehicle = asyncHandler(async (req: Request, res: Response) => {
  const input = registerVehicleSchema.partial().parse(req.body);
  const vehicle = await requireOwnedVehicle(req.params.id, req.userId);
  Object.assign(vehicle, input);
  await vehicle.save();
  res.json(vehicle.toJSON());
});

export const deleteVehicle = asyncHandler(async (req: Request, res: Response) => {
  const vehicle = await requireOwnedVehicle(req.params.id, req.userId);
  await vehicle.deleteOne();
  res.status(204).end();
});
