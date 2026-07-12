import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import { validateRequest } from '../../middleware/validateRequest';
import { parseMultipartJson } from '../../middleware/parseMultipartJson';
import { uploadBlogCover } from '../../config/cloudinary';
import * as controller from './blog.controller';
import { createBlogSchema, updateBlogSchema } from './blog.validation';

const router = Router();

router.get('/', controller.getBlogs);
router.get('/latest', controller.getLatestBlogs);
router.get('/admin/all', authenticate, authorize('admin'), controller.getAdminBlogs);
router.get('/:slug', controller.getBlogBySlug);

router.post(
  '/',
  authenticate,
  authorize('admin'),
  uploadBlogCover.single('coverImage'),
  parseMultipartJson,
  validateRequest(createBlogSchema),
  controller.createBlog
);
router.patch(
  '/:id',
  authenticate,
  authorize('admin'),
  uploadBlogCover.single('coverImage'),
  parseMultipartJson,
  validateRequest(updateBlogSchema),
  controller.updateBlog
);
router.delete('/:id', authenticate, authorize('admin'), controller.deleteBlog);

export default router;
