import { body } from 'express-validator';

export const noticeValidator = [
  body('title').trim().notEmpty().withMessage('Title is required')
];
