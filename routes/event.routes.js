import { Router } from 'express';
import controller from '../controllers/event.controller.js';
import { eventValidator } from '../validators/event.validator.js';
import validate from '../middlewares/validate.middleware.js';
import { protect } from '../middlewares/auth.middleware.js';
import authorize from '../middlewares/role.middleware.js';
import { uploadEventImage } from '../middlewares/upload.middleware.js';

const router = Router();

router.get('/', controller.list);
router.get('/upcoming', controller.upcoming);
router.get('/:id', controller.getOne);
router.get('/slug/:slug', controller.getBySlug);

router.use(protect, authorize('super_admin', 'admin', 'editor'));
router.post('/', uploadEventImage.single('photo'), eventValidator, validate, controller.create);
router.patch('/:id', uploadEventImage.single('photo'), controller.update);
router.delete('/:id', authorize('super_admin', 'admin'), controller.remove);

export default router;
