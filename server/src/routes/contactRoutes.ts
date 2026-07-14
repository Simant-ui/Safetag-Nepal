import { Router } from 'express';
import {
  acknowledgeRequest,
  dialCall,
  initiateCallRequest,
  listRequestsForOwner,
  sendContactRequest,
} from '../controllers/contactController';
import { requireAuth } from '../middleware/requireAuth';
import { publicApiRateLimiter } from '../middleware/rateLimit';

// Mounted at /public/contact-requests
export const contactPublicRoutes = Router();
contactPublicRoutes.use(publicApiRateLimiter);
contactPublicRoutes.post('/', sendContactRequest);

// Mounted at /public/qr — adds the :qrId/call endpoint alongside qrPublicRoutes
export const qrCallRoute = Router();
qrCallRoute.use(publicApiRateLimiter);
qrCallRoute.post('/:qrId/call', initiateCallRequest);
// Plain top-level navigation target (not fetch/XHR) — see dialCall for why this must be a
// browser redirect rather than a JSON response.
qrCallRoute.get('/:qrId/call/dial', dialCall);

// Mounted at /users — adds :id/contact-requests alongside userRoutes
export const contactUserRoutes = Router();
contactUserRoutes.use(requireAuth);
contactUserRoutes.get('/:id/contact-requests', listRequestsForOwner);

// Mounted at /contact-requests
export const contactRequestRoutes = Router();
contactRequestRoutes.use(requireAuth);
contactRequestRoutes.patch('/:id/acknowledge', acknowledgeRequest);
