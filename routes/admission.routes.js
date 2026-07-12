import { Router } from 'express';
import {
  submitAdmission,
  trackAdmission,
  listAdmissions,
  getAdmission,
  updateAdmissionStatus,
  deleteAdmission
} from '../controllers/admission.controller.js';
import { admissionValidator, admissionStatusValidator } from '../validators/admission.validator.js';
import validate from '../middlewares/validate.middleware.js';
import { protect } from '../middlewares/auth.middleware.js';
import authorize from '../middlewares/role.middleware.js';
import { uploadAdmissionDocs } from '../middlewares/upload.middleware.js';
import { contactFormLimiter } from '../middlewares/rateLimiter.middleware.js';

const router = Router();

router.post(
  '/',
  contactFormLimiter,
  uploadAdmissionDocs.array('documents', 5),
  admissionValidator,
  validate,
  submitAdmission
);
router.get('/track/:applicationNumber', trackAdmission);

router.use(protect, authorize('super_admin', 'admin', 'editor'));
router.get('/', listAdmissions);
router.get('/:id', getAdmission);
router.patch('/:id/status', admissionStatusValidator, validate, updateAdmissionStatus);
router.delete('/:id', authorize('super_admin', 'admin'), deleteAdmission);

export default router;
