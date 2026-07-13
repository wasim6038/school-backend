import { Router } from 'express';
import {
  getHomepageContent,
  updateHomepageContent,
  getSettings,
  updateSettings,
  getSeoForRoute,
  upsertSeoForRoute,
  listAllSeo
} from '../controllers/site.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import authorize from '../middlewares/role.middleware.js';

const router = Router();

router.get('/homepage', getHomepageContent);
router.get('/settings', getSettings);
router.get('/seo/:route', getSeoForRoute);

router.use(protect, authorize('super_admin', 'admin', 'editor'));
router.put('/homepage', updateHomepageContent);
router.put('/settings', authorize('super_admin', 'admin'), updateSettings);
router.get('/seo', listAllSeo);
router.put('/seo/:route', upsertSeoForRoute);

export default router;
