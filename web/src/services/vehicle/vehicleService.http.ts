import { apiClient } from '@/services/api/client';
import type { QrTag, Vehicle } from '@/types/models';
import type { VehicleService } from './vehicleService';
import type { RegisterVehicleInput } from './vehicleTypes';

export class HttpVehicleService implements VehicleService {
  async getByUser(userId: string): Promise<Vehicle[]> {
    return apiClient.get<Vehicle[]>(`/users/${userId}/vehicles`);
  }

  async register(
    userId: string,
    input: RegisterVehicleInput,
  ): Promise<{ vehicle: Vehicle; qrTag: QrTag }> {
    return apiClient.post<{ vehicle: Vehicle; qrTag: QrTag }>(`/users/${userId}/vehicles`, input);
  }

  async update(vehicleId: string, input: Partial<RegisterVehicleInput>): Promise<Vehicle> {
    return apiClient.patch<Vehicle>(`/vehicles/${vehicleId}`, input);
  }

  async delete(vehicleId: string): Promise<void> {
    await apiClient.delete(`/vehicles/${vehicleId}`);
  }
}
