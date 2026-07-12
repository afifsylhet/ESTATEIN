import { Router } from 'express';
import { validateRequest } from '../../middleware/validateRequest';
import { formLimiter } from '../../middleware/rateLimiter';
import * as controller from './newsletter.controller';
import { subscribeSchema } from './newsletter.validation';

const router = Router();
router.post('/subscribe', formLimiter, validateRequest(subscribeSchema), controller.subscribe);

export default router;
