import { Router } from 'express';
import {
  listConversations,
  listMessages,
  markConversationRead,
  sendMessage,
  startConversationFromScan,
} from '../controllers/messageController';
import { requireAuth } from '../middleware/requireAuth';
import { publicApiRateLimiter } from '../middleware/rateLimit';

// Mounted at /users
export const messageUserRoutes = Router();
messageUserRoutes.use(requireAuth);
messageUserRoutes.get('/:id/conversations', listConversations);

// Mounted at /conversations
export const conversationRoutes = Router();
conversationRoutes.use(requireAuth);
conversationRoutes.get('/:id/messages', listMessages);
conversationRoutes.post('/:id/messages', sendMessage);
conversationRoutes.patch('/:id/read', markConversationRead);

// Mounted at /public/qr — adds :qrId/conversations alongside qrPublicRoutes/qrCallRoute
export const qrConversationRoute = Router();
qrConversationRoute.use(publicApiRateLimiter);
qrConversationRoute.post('/:qrId/conversations', startConversationFromScan);
