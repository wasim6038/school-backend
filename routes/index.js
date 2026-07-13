import { Router } from 'express';

import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import facultyRoutes from './faculty.routes.js';
import admissionRoutes from './admission.routes.js';
import contactRoutes from './contact.routes.js';
import eventRoutes from './event.routes.js';
import noticeRoutes from './notice.routes.js';
import galleryRoutes from './gallery.routes.js';
import newsRoutes from './news.routes.js';
import siteRoutes from './site.routes.js';
import pageRoutes from './page.routes.js';
import uploadRoutes from './upload.routes.js';

const router = Router();

router.get('/health', (_req, res) => res.status(200).json({ success: true, message: 'API is healthy' }));

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/faculty', facultyRoutes);
router.use('/admissions', admissionRoutes);
router.use('/contact', contactRoutes);
router.use('/events', eventRoutes);
router.use('/notices', noticeRoutes);
router.use('/gallery', galleryRoutes);
router.use('/news', newsRoutes);
router.use('/site', siteRoutes);
router.use('/pages', pageRoutes);
router.use('/upload', uploadRoutes);

export default router;
