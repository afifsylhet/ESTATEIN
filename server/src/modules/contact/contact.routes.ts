import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import { validateRequest } from '../../middleware/validateRequest';
import { formLimiter } from '../../middleware/rateLimiter';
import * as controller from './contact.controller';
import { createContactSchema, updateContactStatusSchema } from './contact.validation';

const router = Router();

router.post('/', formLimiter, validateRequest(createContactSchema), controller.createContact);
router.get('/', authenticate, authorize('admin'), controller.getContacts);
router.patch('/:id/status', authenticate, authorize('admin'), validateRequest(updateContactStatusSchema), controller.updateContactStatus);

export default router;
