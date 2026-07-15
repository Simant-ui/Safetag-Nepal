import type { PublicOwnerView } from '@/types/models';
import { QrTag } from './models/QrTag';
import { User } from './models/User';
import { Vehicle } from './models/Vehicle';
import { Business } from './models/Business';
import { HttpError } from './apiError';
import { assertOwnerSubscriptionActive } from './subscriptionGuard';

/**
 * Builds the response for GET /api/public/qr/:qrId by explicitly constructing the object
 * field-by-field — never spreading a full User/Vehicle/Business document — so phone/email
 * cannot leak into a public response even by accident. This is the server-side half of the
 * same guarantee the frontend's structurally-typed PublicOwnerView enforces at compile time.
 */
export async function buildPublicOwnerView(qrId: string): Promise<PublicOwnerView> {
  const tag = await QrTag.findById(qrId);
  if (!tag) throw new HttpError(404, 'This QR tag does not exist or has been removed.');
  if (tag.status === 'inactive') {
    throw new HttpError(403, 'This QR tag is currently deactivated by its owner.');
  }
  await assertOwnerSubscriptionActive(tag.ownerId);

  const owner = await User.findById(tag.ownerId);
  const nickname = tag.label || owner?.name?.split(' ')[0] || 'SafeTag User';

  const base: PublicOwnerView = {
    qrId: String(tag._id),
    tagType: tag.type,
    status: tag.status,
    nickname,
  };

  if (tag.type === 'vehicle') {
    const vehicle = await Vehicle.findOne({ qrId: tag._id });
    return {
      ...base,
      vehicleNumber: vehicle?.vehicleNumber,
      vehicleTypeLabel: vehicle ? labelForVehicleType(vehicle.vehicleType) : undefined,
      vehicleBrand: vehicle?.brand,
      vehicleModel: vehicle?.model,
    };
  }

  if (tag.type === 'emergency') {
    return {
      ...base,
      bloodGroup: owner?.bloodGroup,
      emergencyNote: owner?.address ? `Lives near ${owner.address}` : undefined,
    };
  }

  if (tag.type === 'business') {
    const business = await Business.findOne({ qrId: tag._id });
    return {
      ...base,
      businessName: business?.name,
      businessCategory: business?.category,
    };
  }

  return base;
}

function labelForVehicleType(type: string): string {
  const labels: Record<string, string> = {
    car: 'Car',
    bike: 'Motorbike',
    scooter: 'Scooter',
    truck: 'Truck',
    other: 'Vehicle',
  };
  return labels[type] ?? 'Vehicle';
}
