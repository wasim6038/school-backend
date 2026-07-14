import { Router } from 'express';
import { getDashboardSummary } from '../controllers/dashboard.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import authorize from '../middlewares/role.middleware.js';

const router = Router();

router.get('/summary', protect, authorize('super_admin', 'admin', 'editor'), getDashboardSummary);

export default router;
