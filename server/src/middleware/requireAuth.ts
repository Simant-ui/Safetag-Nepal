import type { NextFunction, Request, Response } from 'express';
import { verifyToken } from '../utils/jwt';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  const token = header?.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) {
    res.status(401).json({ message: 'Authentication required.' });
    return;
  }

  const payload = verifyToken(token);
  if (!payload) {
    res.status(401).json({ message: 'Invalid or expired session.' });
    return;
  }

  req.userId = payload.userId;
  next();
}
