import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';

type Role = 'user' | 'admin';

/** Role-based guard. Must run after `authenticate`. Usage: authorize('admin') */
export function authorize(...allowedRoles: Role[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(ApiError.unauthorized('You must be logged in to access this resource'));
      return;
    }
    if (!allowedRoles.includes(req.user.role)) {
      next(ApiError.forbidden('You do not have permission to perform this action'));
      return;
    }
    next();
  };
}
