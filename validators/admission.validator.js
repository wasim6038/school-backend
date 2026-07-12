import { body } from 'express-validator';

export const admissionValidator = [
  body('studentName').trim().notEmpty().withMessage('Student name is required'),
  body('dob').isISO8601().withMessage('Valid date of birth is required'),
  body('gender').isIn(['male', 'female', 'other']).withMessage('Gender is required'),
  body('classAppliedFor').trim().notEmpty().withMessage('Class applied for is required'),
  body('parentName').trim().notEmpty().withMessage('Parent/guardian name is required'),
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('phone').trim().notEmpty().withMessage('Phone number is required'),
  body('address').trim().notEmpty().withMessage('Address is required')
];

export const admissionStatusValidator = [
  body('status')
    .isIn(['pending', 'under_review', 'approved', 'rejected'])
    .withMessage('Invalid status value')
];
