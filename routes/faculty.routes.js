import { Router } from 'express';
import controller from '../controllers/faculty.controller.js';
import { facultyValidator } from '../validators/faculty.validator.js';
import validate from '../middlewares/validate.middleware.js';
import { protect } from '../middlewares/auth.middleware.js';
import authorize from '../middlewares/role.middleware.js';
import { uploadFacultyPhoto } from '../middlewares/upload.middleware.js';

const router = Router();

router.get('/', controller.list);
router.get('/:id', controller.getOne);

router.use(protect, authorize('super_admin', 'admin', 'editor'));
router.post('/', uploadFacultyPhoto.single('photo'), facultyValidator, validate, controller.create);
router.patch('/:id', uploadFacultyPhoto.single('photo'), controller.update);
router.delete('/:id', authorize('super_admin', 'admin'), controller.remove);

export default router;
