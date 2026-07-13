import { Router } from 'express';
import controller from '../controllers/news.controller.js';
import { newsValidator } from '../validators/news.validator.js';
import validate from '../middlewares/validate.middleware.js';
import { protect } from '../middlewares/auth.middleware.js';
import authorize from '../middlewares/role.middleware.js';
import { uploadNewsImage } from '../middlewares/upload.middleware.js';

const router = Router();

router.get('/', controller.list);
router.get('/slug/:slug', controller.getBySlugAndTrackView);
router.get('/:id', controller.getOne);

router.use(protect, authorize('super_admin', 'admin', 'editor'));
router.post('/', uploadNewsImage.single('coverImage'), newsValidator, validate, controller.create);
router.patch('/:id', uploadNewsImage.single('coverImage'), controller.update);
router.delete('/:id', authorize('super_admin', 'admin'), controller.remove);

export default router;
