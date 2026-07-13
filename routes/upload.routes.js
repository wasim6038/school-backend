import { Router } from 'express';
import { uploadSingleFile, deleteFile } from '../controllers/upload.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import authorize from '../middlewares/role.middleware.js';
import { uploadPageAsset } from '../middlewares/upload.middleware.js';

const router = Router();

router.use(protect, authorize('super_admin', 'admin', 'editor'));
router.post('/', uploadPageAsset.single('file'), uploadSingleFile);
router.delete('/:publicId', authorize('super_admin', 'admin'), deleteFile);

export default router;
