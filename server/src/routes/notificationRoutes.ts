import { Router } from 'express';
import { listNotifications, markNotificationRead } from '../controllers/notificationController';
import { requireAuth } from '../middleware/requireAuth';

// Mounted at /users
export const notificationUserRoutes = Router();
notificationUserRoutes.use(requireAuth);
notificationUserRoutes.get('/:id/notifications', listNotifications);

// Mounted at /notifications
export const notificationRoutes = Router();
notificationRoutes.use(requireAuth);
notificationRoutes.patch('/:id/read', markNotificationRead);
