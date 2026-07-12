import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { ApiError } from '../utils/ApiError';

/** Generic Zod validation middleware. Validates body/query/params together against `schema`. */
export function validateRequest(schema: AnyZodObject) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      const parsed = schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      if (parsed.body) req.body = parsed.body;
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const errors: Record<string, string> = {};
        for (const issue of err.issues) {
          const key = issue.path.slice(1).join('.') || issue.path.join('.') || 'value';
          errors[key] = issue.message;
        }
        next(ApiError.badRequest('Validation failed', errors));
        return;
      }
      next(err);
    }
  };
}
