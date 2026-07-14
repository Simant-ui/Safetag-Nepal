import type { QrTag, Vehicle } from '@/types/models';
import type { RegisterVehicleInput } from './vehicleTypes';

export interface VehicleService {
  getByUser(userId: string): Promise<Vehicle[]>;
  /** Registers the vehicle and creates its linked Vehicle QR tag in one step. */
  register(userId: string, input: RegisterVehicleInput): Promise<{ vehicle: Vehicle; qrTag: QrTag }>;
  update(vehicleId: string, input: Partial<RegisterVehicleInput>): Promise<Vehicle>;
  delete(vehicleId: string): Promise<void>;
}
