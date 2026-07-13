import { body } from 'express-validator';

export const pageValidator = [
  body('slug').trim().notEmpty().withMessage('Slug is required'),
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('sections').optional().isArray().withMessage('Sections must be an array')
];
