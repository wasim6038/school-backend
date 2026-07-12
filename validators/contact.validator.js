import { body } from 'express-validator';

export const contactValidator = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('message').trim().isLength({ min: 5 }).withMessage('Message must be at least 5 characters')
];
