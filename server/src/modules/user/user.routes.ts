import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import { validateRequest } from '../../middleware/validateRequest';
import { uploadAvatar } from '../../config/cloudinary';
import * as controller from './user.controller';
import { updateUserSchema, updatePasswordSchema, listUsersQuerySchema } from './user.validation';

const router = Router();

router.use(authenticate);

router.get('/', authorize('admin'), validateRequest(listUsersQuerySchema), controller.getUsers);
router.get('/:id', controller.getUser);
router.patch('/:id', validateRequest(updateUserSchema), controller.updateUser);
router.patch('/:id/avatar', uploadAvatar.single('avatar'), controller.updateAvatar);
router.patch('/:id/password', validateRequest(updatePasswordSchema), controller.updatePassword);
router.delete('/:id', authorize('admin'), controller.deleteUser);

export default router;
