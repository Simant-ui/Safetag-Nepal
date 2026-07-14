import { Router } from 'express';
import { getSession, loginWithGoogle, logout, sendOtp, verifyOtp } from '../controllers/authController';
import { requireAuth } from '../middleware/requireAuth';
import { otpRateLimiter } from '../middleware/rateLimit';

export const authRoutes = Router();

authRoutes.post('/otp/send', otpRateLimiter, sendOtp);
authRoutes.post('/otp/verify', verifyOtp);
authRoutes.post('/google', loginWithGoogle);
authRoutes.get('/session', requireAuth, getSession);
authRoutes.post('/logout', requireAuth, logout);
