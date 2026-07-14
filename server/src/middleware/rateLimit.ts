import rateLimit from 'express-rate-limit';

export const otpRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  keyGenerator: (req) => `${req.ip}:${req.body?.phone ?? ''}`,
  message: { message: 'Too many OTP requests. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

export const publicApiRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 60,
  message: { message: 'Too many requests. Please slow down.' },
  standardHeaders: true,
  legacyHeaders: false,
});

export const generalApiRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 200,
  standardHeaders: true,
  legacyHeaders: false,
});
