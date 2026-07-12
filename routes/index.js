import { Router } from 'express';

import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import facultyRoutes from './faculty.routes.js';
import admissionRoutes from './admission.routes.js';


const router = Router();

router.get('/health', (_req, res) => res.status(200).json({ success: true, message: 'API is healthy' }));

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/faculty', facultyRoutes);
router.use('/admissions', admissionRoutes);


export default router;
