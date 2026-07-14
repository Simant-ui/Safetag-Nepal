import type { QrTag, Vehicle } from '@/types/models';
import { mockDb, simulateLatency } from '@/services/mockDb/db';
import type { VehicleService } from './vehicleService';
import type { RegisterVehicleInput } from './vehicleTypes';

export class MockVehicleService implements VehicleService {
  async getByUser(userId: string): Promise<Vehicle[]> {
    await simulateLatency(100);
    return mockDb.vehicles.filter((v) => v.userId === userId);
  }

  async register(
    userId: string,
    input: RegisterVehicleInput,
  ): Promise<{ vehicle: Vehicle; qrTag: QrTag }> {
    await simulateLatency(150);

    const qrTag: QrTag = {
      qrId: mockDb.genId('qr'),
      ownerId: userId,
      type: 'vehicle',
      status: 'active',
      label: input.qrLabel ?? input.vehicleNumber,
      scanCount: 0,
      createdAt: new Date().toISOString(),
    };
    mockDb.qrTags.push(qrTag);

    const vehicle: Vehicle = {
      vehicleId: mockDb.genId('veh'),
      userId,
      vehicleNumber: input.vehicleNumber,
      vehicleType: input.vehicleType,
      brand: input.brand,
      model: input.model,
      color: input.color,
      year: input.year,
      image: input.image,
      qrId: qrTag.qrId,
    };
    mockDb.vehicles.push(vehicle);

    return { vehicle, qrTag };
  }

  async update(vehicleId: string, input: Partial<RegisterVehicleInput>): Promise<Vehicle> {
    await simulateLatency(100);
    const vehicle = mockDb.vehicles.find((v) => v.vehicleId === vehicleId);
    if (!vehicle) throw new Error('Vehicle not found.');
    Object.assign(vehicle, input);
    return vehicle;
  }

  async delete(vehicleId: string): Promise<void> {
    await simulateLatency(80);
    mockDb.vehicles = mockDb.vehicles.filter((v) => v.vehicleId !== vehicleId);
  }
}
