import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate';
import { validateRequest } from '../../middleware/validateRequest';
import { authLimiter } from '../../middleware/rateLimiter';
import * as controller from './auth.controller';
import { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } from './auth.validation';

const router = Router();

router.post('/register', authLimiter, validateRequest(registerSchema), controller.register);
router.post('/login', authLimiter, validateRequest(loginSchema), controller.login);
router.post('/refresh', controller.refresh);
router.post('/forgot-password', authLimiter, validateRequest(forgotPasswordSchema), controller.forgotPassword);
router.post('/reset-password', authLimiter, validateRequest(resetPasswordSchema), controller.resetPassword);
// Logout is intentionally unauthenticated: it clears the refresh cookie based on
// the cookie itself, so it works even when the access token has expired.
router.post('/logout', controller.logout);
router.get('/me', authenticate, controller.me);

export default router;
