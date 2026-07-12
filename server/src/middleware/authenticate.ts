import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';
import { verifyAccessToken } from '../utils/generateTokens';

/** Verifies the JWT access token (Authorization: Bearer <token>) and attaches req.user. */
export function authenticate(req: Request, _res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  const token = header?.startsWith('Bearer ') ? header.slice(7) : undefined;

  if (!token) {
    next(ApiError.unauthorized('Authentication token is missing'));
    return;
  }

  try {
    req.user = verifyAccessToken(token);
    next();
  } catch {
    next(ApiError.unauthorized('Invalid or expired token'));
  }
}

/** Attaches req.user if a valid token is present, but never rejects the request. */
export function attachUserIfPresent(req: Request, _res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  const token = header?.startsWith('Bearer ') ? header.slice(7) : undefined;
  if (!token) {
    next();
    return;
  }
  try {
    req.user = verifyAccessToken(token);
  } catch {
    // ignore invalid token for optional-auth routes
  }
  next();
}
