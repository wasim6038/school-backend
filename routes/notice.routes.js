import { Router } from 'express';
import controller from '../controllers/notice.controller.js';
import { noticeValidator } from '../validators/notice.validator.js';
import validate from '../middlewares/validate.middleware.js';
import { protect } from '../middlewares/auth.middleware.js';
import authorize from '../middlewares/role.middleware.js';

const router = Router();

router.get('/', controller.list);
router.get('/:id', controller.getOne);

router.use(protect, authorize('super_admin', 'admin', 'editor'));
router.post('/', noticeValidator, validate, controller.create);
router.patch('/:id', controller.update);
router.delete('/:id', authorize('super_admin', 'admin'), controller.remove);

export default router;
