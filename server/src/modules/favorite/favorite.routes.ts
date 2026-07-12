import { Router } from 'express';
import { z } from 'zod';
import { authenticate } from '../../middleware/authenticate';
import { validateRequest } from '../../middleware/validateRequest';
import * as controller from './favorite.controller';

const router = Router();
router.use(authenticate);

const addFavoriteSchema = z.object({
  body: z.object({ property: z.string().min(1, 'Property is required') }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});

router.get('/', controller.getMyFavorites);
router.post('/', validateRequest(addFavoriteSchema), controller.addFavorite);
router.delete('/:propertyId', controller.removeFavorite);

export default router;
