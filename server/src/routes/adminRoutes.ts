import { Router } from 'express';
import {
  adminCreateCustomer,
  adminLogin,
  adminUpdateSubscription,
  getAnalytics,
  getCustomerDetail,
  listCustomers,
} from '../controllers/adminController';
import { requireAdmin } from '../middleware/requireAdmin';
import { otpRateLimiter } from '../middleware/rateLimit';

export const adminRoutes = Router();

adminRoutes.post('/login', otpRateLimiter, adminLogin);
adminRoutes.get('/customers', requireAdmin, listCustomers);
adminRoutes.post('/customers', requireAdmin, adminCreateCustomer);
adminRoutes.get('/customers/:userId', requireAdmin, getCustomerDetail);
adminRoutes.patch('/customers/:userId/subscription', requireAdmin, adminUpdateSubscription);
adminRoutes.get('/analytics', requireAdmin, getAnalytics);
