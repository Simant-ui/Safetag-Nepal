import { Router } from 'express';
import { deleteVehicle, getByUser, registerVehicle, updateVehicle } from '../controllers/vehicleController';
import { requireAuth } from '../middleware/requireAuth';

export const vehicleUserRoutes = Router();
vehicleUserRoutes.use(requireAuth);
vehicleUserRoutes.get('/:id/vehicles', getByUser);
vehicleUserRoutes.post('/:id/vehicles', registerVehicle);

export const vehicleRoutes = Router();
vehicleRoutes.use(requireAuth);
vehicleRoutes.patch('/:id', updateVehicle);
vehicleRoutes.delete('/:id', deleteVehicle);
