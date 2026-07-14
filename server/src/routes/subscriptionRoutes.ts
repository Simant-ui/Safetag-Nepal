import { Router } from 'express';
import { getCurrentSubscription, listPlans, upgradeSubscription } from '../controllers/subscriptionController';
import { requireAuth } from '../middleware/requireAuth';

export const subscriptionPlansRoute = Router();
subscriptionPlansRoute.get('/', listPlans);

// Mounted at /users — adds subscription sub-routes alongside userRoutes
export const subscriptionUserRoutes = Router();
subscriptionUserRoutes.use(requireAuth);
subscriptionUserRoutes.get('/:id/subscription', getCurrentSubscription);
subscriptionUserRoutes.post('/:id/subscription/upgrade', upgradeSubscription);
