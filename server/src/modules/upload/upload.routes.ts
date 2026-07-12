import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import { uploadGeneric } from './upload.middleware';
import * as controller from './upload.controller';

const router = Router();

// Standalone endpoint (e.g. rich-text editor images inside Blog content) — admin only.
router.post('/', authenticate, authorize('admin'), uploadGeneric.single('image'), controller.uploadImage);

export default router;
