import { body } from 'express-validator';

export const eventValidator = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('startDate').isISO8601().withMessage('Valid start date is required'),
  body('endDate').optional().isISO8601().withMessage('Valid end date required'),
  body('category').optional().isIn(['academic', 'sports', 'cultural', 'holiday', 'other'])
];
