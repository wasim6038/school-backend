import { body } from 'express-validator';

export const testimonialValidator = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('message').trim().notEmpty().withMessage('Message is required'),
  body('rating').optional().isInt({ min: 1, max: 5 }).withMessage('Rating must be 1-5')
];
