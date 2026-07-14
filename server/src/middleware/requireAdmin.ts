import type { NextFunction, Request, Response } from 'express';
import { verifyAdminToken } from '../utils/jwt';

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  const token = header?.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token || !verifyAdminToken(token)) {
    res.status(401).json({ message: 'Admin authentication required.' });
    return;
  }
  next();
}
