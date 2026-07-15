import jwt from 'jsonwebtoken';
import type { NextRequest } from 'next/server';

function jwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('Missing required environment variable: JWT_SECRET');
  return secret;
}

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? '30d';

export interface TokenPayload {
  userId: string;
}

export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, jwtSecret(), { expiresIn: JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'] });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, jwtSecret()) as TokenPayload;
  } catch {
    return null;
  }
}

export interface AdminTokenPayload {
  admin: true;
}

export function signAdminToken(): string {
  return jwt.sign({ admin: true }, jwtSecret(), { expiresIn: '12h' });
}

export function verifyAdminToken(token: string): AdminTokenPayload | null {
  try {
    const decoded = jwt.verify(token, jwtSecret()) as AdminTokenPayload;
    return decoded.admin ? decoded : null;
  } catch {
    return null;
  }
}

function extractBearerToken(req: NextRequest): string | null {
  const header = req.headers.get('authorization');
  return header?.startsWith('Bearer ') ? header.slice(7) : null;
}

/** Returns the decoded session payload, or null if missing/invalid — callers return 401. */
export function requireAuth(req: NextRequest): TokenPayload | null {
  const token = extractBearerToken(req);
  if (!token) return null;
  return verifyToken(token);
}

/** Returns the decoded admin payload, or null if missing/invalid — callers return 401. */
export function requireAdmin(req: NextRequest): AdminTokenPayload | null {
  const token = extractBearerToken(req);
  if (!token) return null;
  return verifyAdminToken(token);
}
