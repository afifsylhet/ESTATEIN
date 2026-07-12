import { Router } from 'express';
import { authenticate, attachUserIfPresent } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import { validateRequest } from '../../middleware/validateRequest';
import { formLimiter } from '../../middleware/rateLimiter';
import * as controller from './inquiry.controller';
import { createInquirySchema, updateInquiryStatusSchema } from './inquiry.validation';

const router = Router();

router.post('/', formLimiter, attachUserIfPresent, validateRequest(createInquirySchema), controller.createInquiry);
router.get('/me', authenticate, controller.getMyInquiries);
router.get('/', authenticate, authorize('admin'), controller.getInquiries);
router.patch('/:id/status', authenticate, authorize('admin'), validateRequest(updateInquiryStatusSchema), controller.updateInquiryStatus);
router.delete('/:id', authenticate, authorize('admin'), controller.deleteInquiry);

export default router;
