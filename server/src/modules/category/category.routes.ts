import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import { validateRequest } from '../../middleware/validateRequest';
import * as controller from './category.controller';
import { createCategorySchema, updateCategorySchema } from './category.validation';

const router = Router();

router.get('/', controller.getCategories);
router.post('/', authenticate, authorize('admin'), validateRequest(createCategorySchema), controller.createCategory);
router.patch('/:id', authenticate, authorize('admin'), validateRequest(updateCategorySchema), controller.updateCategory);
router.delete('/:id', authenticate, authorize('admin'), controller.deleteCategory);

export default router;
