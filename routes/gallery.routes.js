import { Router } from 'express';
import controller from '../controllers/gallery.controller.js';
import validate from '../middlewares/validate.middleware.js';
import { protect } from '../middlewares/auth.middleware.js';
import authorize from '../middlewares/role.middleware.js';
import { uploadGalleryMedia } from '../middlewares/upload.middleware.js';
import { body } from 'express-validator';

const router = Router();

router.get('/', controller.list);
router.get('/:id', controller.getOne);

router.use(protect, authorize('super_admin', 'admin', 'editor'));
router.post(
  '/',
  uploadGalleryMedia.single('media'),
  [body('title').trim().notEmpty().withMessage('Title is required')],
  validate,
  controller.create
);
router.patch('/:id', uploadGalleryMedia.single('media'), controller.update);
router.delete('/:id', authorize('super_admin', 'admin'), controller.remove);

export default router;
