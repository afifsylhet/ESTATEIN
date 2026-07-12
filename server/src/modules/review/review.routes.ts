import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate';
import { validateRequest } from '../../middleware/validateRequest';
import * as controller from './review.controller';
import { createReviewSchema } from './review.validation';

const router = Router();

router.get('/property/:propertyId', controller.getPropertyReviews);
router.post('/', authenticate, validateRequest(createReviewSchema), controller.createReview);
router.delete('/:id', authenticate, controller.deleteReview);

export default router;
