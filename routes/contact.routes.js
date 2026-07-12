import { Router } from 'express';
import {
  submitContactMessage,
  listContactMessages,
  updateMessageStatus,
  deleteContactMessage
} from '../controllers/contact.controller.js';
import { contactValidator } from '../validators/contact.validator.js';
import validate from '../middlewares/validate.middleware.js';
import { protect } from '../middlewares/auth.middleware.js';
import authorize from '../middlewares/role.middleware.js';
import { contactFormLimiter } from '../middlewares/rateLimiter.middleware.js';

const router = Router();

router.post('/', contactFormLimiter, contactValidator, validate, submitContactMessage);

router.use(protect, authorize('super_admin', 'admin', 'editor'));
router.get('/', listContactMessages);
router.patch('/:id', updateMessageStatus);
router.delete('/:id', authorize('super_admin', 'admin'), deleteContactMessage);

export default router;
