import { Router } from 'express';
import { login, refresh, logout, getMe, changePassword } from '../controllers/auth.controller.js';
import { loginValidator, changePasswordValidator } from '../validators/auth.validator.js';
import validate from '../middlewares/validate.middleware.js';
import { protect } from '../middlewares/auth.middleware.js';
import { authLimiter } from '../middlewares/rateLimiter.middleware.js';

const router = Router();

router.post('/login', authLimiter, loginValidator, validate, login);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.get('/me', protect, getMe);
router.patch('/change-password', protect, changePasswordValidator, validate, changePassword);

export default router;
