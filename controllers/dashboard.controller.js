import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import Admission from '../models/Admission.js';
import ContactMessage from '../models/ContactMessage.js';
import News from '../models/News.js';
import Event from '../models/Event.js';
import Faculty from '../models/Faculty.js';
import GalleryItem from '../models/GalleryItem.js';
import Notice from '../models/Notice.js';
import Testimonial from '../models/Testimonial.js';
import User from '../models/User.js';

/**
 * GET /dashboard/summary - Admin only. Aggregate counts for the analytics
 * dashboard landing page, computed with a single Promise.all round trip.
 */
export const getDashboardSummary = asyncHandler(async (_req, res) => {
  const [
    totalAdmissions,
    pendingAdmissions,
    unreadMessages,
    totalNews,
    upcomingEvents,
    totalFaculty,
    totalGalleryItems,
    activeNotices,
    totalTestimonials,
    totalUsers
  ] = await Promise.all([
    Admission.countDocuments(),
    Admission.countDocuments({ status: 'pending' }),
    ContactMessage.countDocuments({ status: 'new' }),
    News.countDocuments({ isPublished: true }),
    Event.countDocuments({ isActive: true, startDate: { $gte: new Date() } }),
    Faculty.countDocuments({ isActive: true }),
    GalleryItem.countDocuments({ isActive: true }),
    Notice.countDocuments({ isActive: true }),
    Testimonial.countDocuments({ isActive: true }),
    User.countDocuments()
  ]);

  const recentAdmissions = await Admission.find()
    .sort('-createdAt')
    .limit(5)
    .select('studentName classAppliedFor status applicationNumber createdAt');

  const recentMessages = await ContactMessage.find()
    .sort('-createdAt')
    .limit(5)
    .select('name email subject status createdAt');

  new ApiResponse(
    200,
    {
      counts: {
        totalAdmissions,
        pendingAdmissions,
        unreadMessages,
        totalNews,
        upcomingEvents,
        totalFaculty,
        totalGalleryItems,
        activeNotices,
        totalTestimonials,
        totalUsers
      },
      recentAdmissions,
      recentMessages
    },
    'Dashboard summary fetched'
  ).send(res);
});
