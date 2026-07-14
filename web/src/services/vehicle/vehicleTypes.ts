import type { VehicleType } from '@/types/models';

export interface RegisterVehicleInput {
  vehicleNumber: string;
  vehicleType: VehicleType;
  brand?: string;
  model?: string;
  color?: string;
  year?: number;
  image?: string;
  qrLabel?: string;
}
