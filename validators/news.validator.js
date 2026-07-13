import { body } from 'express-validator';

export const newsValidator = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('content').trim().notEmpty().withMessage('Content is required'),
  body('preview').optional().trim().isLength({ max: 300 }).withMessage('Preview too long')
];
