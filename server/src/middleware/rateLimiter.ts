import rateLimit from 'express-rate-limit';

/** Strict limiter for auth endpoints (brute-force / credential-stuffing mitigation). */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many attempts. Please try again in a few minutes.' },
});

/** Anti-spam limiter for public lead-generation forms (inquiries, contact, newsletter). */
export const formLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many submissions. Please try again later.' },
});

/** Baseline limiter applied to the whole API. */
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 500,
  standardHeaders: true,
  legacyHeaders: false,
});
