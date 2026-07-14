import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export interface TokenPayload {
  userId: string;
}

export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, env.jwtSecret, { expiresIn: env.jwtExpiresIn as jwt.SignOptions['expiresIn'] });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, env.jwtSecret) as TokenPayload;
  } catch {
    return null;
  }
}

export interface AdminTokenPayload {
  admin: true;
}

export function signAdminToken(): string {
  return jwt.sign({ admin: true }, env.jwtSecret, { expiresIn: '12h' });
}

export function verifyAdminToken(token: string): AdminTokenPayload | null {
  try {
    const decoded = jwt.verify(token, env.jwtSecret) as AdminTokenPayload;
    return decoded.admin ? decoded : null;
  } catch {
    return null;
  }
}
