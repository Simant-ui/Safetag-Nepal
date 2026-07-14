import { Router } from 'express';
import { authRoutes } from './authRoutes';
import { userRoutes } from './userRoutes';
import { qrUserRoutes, qrTagRoutes, qrPublicRoutes } from './qrRoutes';
import { vehicleUserRoutes, vehicleRoutes } from './vehicleRoutes';
import { businessUserRoutes, businessRoutes } from './businessRoutes';
import { contactPublicRoutes, qrCallRoute, contactUserRoutes, contactRequestRoutes } from './contactRoutes';
import { subscriptionPlansRoute, subscriptionUserRoutes } from './subscriptionRoutes';
import { messageUserRoutes, conversationRoutes, qrConversationRoute } from './messageRoutes';
import { notificationUserRoutes, notificationRoutes } from './notificationRoutes';
import { adminRoutes } from './adminRoutes';

export const apiRouter = Router();

apiRouter.use('/auth', authRoutes);

// All of these are mounted at /users and merge onto the same :id-scoped resource path.
apiRouter.use('/users', userRoutes);
apiRouter.use('/users', qrUserRoutes);
apiRouter.use('/users', vehicleUserRoutes);
apiRouter.use('/users', businessUserRoutes);
apiRouter.use('/users', contactUserRoutes);
apiRouter.use('/users', subscriptionUserRoutes);
apiRouter.use('/users', messageUserRoutes);
apiRouter.use('/users', notificationUserRoutes);

apiRouter.use('/qr-tags', qrTagRoutes);
apiRouter.use('/vehicles', vehicleRoutes);
apiRouter.use('/businesses', businessRoutes);
apiRouter.use('/contact-requests', contactRequestRoutes);
apiRouter.use('/subscription-plans', subscriptionPlansRoute);
apiRouter.use('/conversations', conversationRoutes);
apiRouter.use('/notifications', notificationRoutes);

// Public, unauthenticated surface — reachable by anonymous QR scanners.
apiRouter.use('/public/contact-requests', contactPublicRoutes);
apiRouter.use('/public/qr', qrPublicRoutes);
apiRouter.use('/public/qr', qrCallRoute);
apiRouter.use('/public/qr', qrConversationRoute);

apiRouter.use('/admin', adminRoutes);
