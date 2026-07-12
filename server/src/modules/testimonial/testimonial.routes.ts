import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import { validateRequest } from '../../middleware/validateRequest';
import { formLimiter } from '../../middleware/rateLimiter';
import * as controller from './testimonial.controller';
import { createTestimonialSchema, moderateTestimonialSchema } from './testimonial.validation';

const router = Router();

router.get('/', controller.getTestimonials);
router.get('/admin/all', authenticate, authorize('admin'), controller.getAdminTestimonials);
router.post('/', formLimiter, validateRequest(createTestimonialSchema), controller.createTestimonial);
router.patch('/:id/moderate', authenticate, authorize('admin'), validateRequest(moderateTestimonialSchema), controller.moderateTestimonial);
router.delete('/:id', authenticate, authorize('admin'), controller.deleteTestimonial);

export default router;
