import { Router } from 'express';
import { listUsers, createUser, updateUser, deleteUser } from '../controllers/user.controller.js';
import { createUserValidator } from '../validators/auth.validator.js';
import validate from '../middlewares/validate.middleware.js';
import { protect } from '../middlewares/auth.middleware.js';
import authorize from '../middlewares/role.middleware.js';

const router = Router();

router.use(protect, authorize('super_admin', 'admin'));

router.get('/', listUsers);
router.post('/', authorize('super_admin'), createUserValidator, validate, createUser);
router.patch('/:id', authorize('super_admin'), updateUser);
router.delete('/:id', authorize('super_admin'), deleteUser);

export default router;
