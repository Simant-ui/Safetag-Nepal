import { Router } from 'express';
import { getByUser, registerBusiness, updateBusiness } from '../controllers/businessController';
import { requireAuth } from '../middleware/requireAuth';

export const businessUserRoutes = Router();
businessUserRoutes.use(requireAuth);
businessUserRoutes.get('/:id/businesses', getByUser);
businessUserRoutes.post('/:id/businesses', registerBusiness);

export const businessRoutes = Router();
businessRoutes.use(requireAuth);
businessRoutes.patch('/:id', updateBusiness);
