import { body } from 'express-validator';

export const facultyValidator = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('designation').trim().notEmpty().withMessage('Designation is required'),
  // body('department').trim().notEmpty().withMessage('Department is required'),
  body('email').optional().isEmail().withMessage('Invalid email'),
  body('experienceYears').optional().isInt({ min: 0 }).withMessage('Experience must be a positive number')
];
