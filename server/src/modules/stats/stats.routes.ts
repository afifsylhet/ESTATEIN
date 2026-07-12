import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import * as controller from './stats.controller';

const router = Router();

router.get('/homepage', controller.getHomepageStats);
router.get('/admin/overview', authenticate, authorize('admin'), controller.getAdminOverview);
router.get('/admin/properties-per-month', authenticate, authorize('admin'), controller.getPropertiesPerMonth);
router.get('/admin/inquiries-over-time', authenticate, authorize('admin'), controller.getInquiriesOverTime);
router.get('/admin/properties-by-type', authenticate, authorize('admin'), controller.getPropertiesByType);
router.get('/admin/properties-by-status', authenticate, authorize('admin'), controller.getPropertiesByStatus);
router.get('/dashboard/user', authenticate, controller.getUserOverview);

export default router;
