import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { ApiError } from '../utils/ApiError';
import { isProd } from '../config/env';

interface MongoDuplicateKeyError extends Error {
  code?: number;
  keyValue?: Record<string, unknown>;
}

interface CloudinaryLikeError {
  message?: string;
  name?: string;
  http_code?: number;
}

/**
 * Last middleware in the chain. Normalizes every thrown error into the standard
 * `{ success: false, message, errors? }` shape. Never leaks stack traces in production.
 */
export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void {
  let statusCode = 500;
  let message = 'Something went wrong on our end. Please try again.';
  let errors: Record<string, string> | undefined;

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    errors = err.errors;
  } else if (err instanceof mongoose.Error.ValidationError) {
    statusCode = 400;
    message = 'Validation failed';
    errors = Object.fromEntries(
      Object.entries(err.errors).map(([key, value]) => [key, value.message])
    );
  } else if (err instanceof mongoose.Error.CastError) {
    statusCode = 400;
    message = `Invalid value for field "${err.path}"`;
  } else if (isDuplicateKeyError(err)) {
    statusCode = 409;
    const field = Object.keys(err.keyValue ?? {})[0] ?? 'field';
    message = `An account or record with this ${field} already exists`;
    errors = { [field]: `This ${field} is already in use` };
  } else if (isJwtError(err)) {
    statusCode = 401;
    message = err.name === 'TokenExpiredError' ? 'Session expired, please log in again' : 'Invalid authentication token';
  } else if (isCloudinaryError(err)) {
    // Cloudinary auth/signature issues come through as plain objects from
    // multer-storage-cloudinary/q. Map them to an actionable response.
    statusCode = 502;
    message = 'Image upload service failed. Check Cloudinary credentials (cloud name, API key, API secret).';
  } else if (err instanceof Error) {
    message = isProd ? message : err.message;
  }

  if (!isProd && statusCode === 500) {
    // eslint-disable-next-line no-console
    console.error(`[ERROR] ${req.method} ${req.originalUrl}:`, err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(errors ? { errors } : {}),
    ...(!isProd && err instanceof Error ? { stack: err.stack } : {}),
  });
}

function isDuplicateKeyError(err: unknown): err is MongoDuplicateKeyError {
  return typeof err === 'object' && err !== null && (err as MongoDuplicateKeyError).code === 11000;
}

function isJwtError(err: unknown): err is Error {
  return err instanceof Error && ['JsonWebTokenError', 'TokenExpiredError', 'NotBeforeError'].includes(err.name);
}

function isCloudinaryError(err: unknown): err is CloudinaryLikeError {
  if (typeof err !== 'object' || err === null) return false;
  const maybe = err as CloudinaryLikeError;
  return maybe.name === 'Error' && typeof maybe.message === 'string' && typeof maybe.http_code === 'number';
}
