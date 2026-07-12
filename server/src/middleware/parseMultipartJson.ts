import { Request, Response, NextFunction } from 'express';

const JSON_FIELDS = ['location', 'specifications', 'amenities', 'coordinates', 'tags'];

/**
 * multipart/form-data (used for image uploads) only carries string fields.
 * Nested objects/arrays (location, specifications, amenities) arrive as JSON strings —
 * this middleware parses them back into real objects before validation runs.
 */
export function parseMultipartJson(req: Request, _res: Response, next: NextFunction): void {
  for (const field of JSON_FIELDS) {
    const value = req.body?.[field];
    if (typeof value === 'string') {
      try {
        req.body[field] = JSON.parse(value);
      } catch {
        // leave as-is; downstream zod validation will report a clear error
      }
    }
  }
  next();
}
