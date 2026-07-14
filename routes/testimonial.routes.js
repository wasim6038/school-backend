import { Router } from 'express';
import controller from '../controllers/testimonial.controller.js';
import { testimonialValidator } from '../validators/testimonial.validator.js';
import validate from '../middlewares/validate.middleware.js';
import { protect } from '../middlewares/auth.middleware.js';
import authorize from '../middlewares/role.middleware.js';
import { uploadTestimonialPhoto } from '../middlewares/upload.middleware.js';

const router = Router();

router.get('/', controller.list);

router.use(protect, authorize('super_admin', 'admin', 'editor'));
router.post('/', uploadTestimonialPhoto.single('photo'), testimonialValidator, validate, controller.create);
router.patch('/:id', uploadTestimonialPhoto.single('photo'), controller.update);
router.delete('/:id', authorize('super_admin', 'admin'), controller.remove);

export default router;
