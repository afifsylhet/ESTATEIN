import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import { validateRequest } from '../../middleware/validateRequest';
import { parseMultipartJson } from '../../middleware/parseMultipartJson';
import { uploadPropertyImages } from '../../config/cloudinary';
import * as controller from './property.controller';
import { createPropertySchema, updatePropertySchema, listPropertiesQuerySchema } from './property.validation';

const router = Router();

router.get('/', validateRequest(listPropertiesQuerySchema), controller.getProperties);
router.get('/featured', controller.getFeaturedProperties);
router.get('/:slug', controller.getPropertyBySlug);
router.get('/:id/related', controller.getRelatedProperties);

router.post(
  '/',
  authenticate,
  authorize('admin'),
  uploadPropertyImages.array('images', 10),
  parseMultipartJson,
  validateRequest(createPropertySchema),
  controller.createProperty
);
router.patch(
  '/:id',
  authenticate,
  authorize('admin'),
  uploadPropertyImages.array('images', 10),
  parseMultipartJson,
  validateRequest(updatePropertySchema),
  controller.updateProperty
);
router.delete('/:id', authenticate, authorize('admin'), controller.deleteProperty);

export default router;
