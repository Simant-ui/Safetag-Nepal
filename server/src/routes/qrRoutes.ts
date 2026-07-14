import { Router } from 'express';
import {
  createTag,
  deleteTag,
  getScanHistory,
  getTagPublic,
  listMyTags,
  recordScan,
  setStatus,
} from '../controllers/qrController';
import { requireAuth } from '../middleware/requireAuth';
import { publicApiRateLimiter } from '../middleware/rateLimit';

export const qrUserRoutes = Router();
qrUserRoutes.use(requireAuth);
qrUserRoutes.get('/:id/qr-tags', listMyTags);
qrUserRoutes.post('/:id/qr-tags', createTag);

export const qrTagRoutes = Router();
qrTagRoutes.use(requireAuth);
qrTagRoutes.patch('/:qrId/status', setStatus);
qrTagRoutes.get('/:qrId/scan-history', getScanHistory);
qrTagRoutes.delete('/:qrId', deleteTag);

export const qrPublicRoutes = Router();
qrPublicRoutes.use(publicApiRateLimiter);
qrPublicRoutes.get('/:qrId', getTagPublic);
qrPublicRoutes.post('/:qrId/scan', recordScan);
