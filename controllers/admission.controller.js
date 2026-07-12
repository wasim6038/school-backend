import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import Admission from '../models/Admission.js';
import BaseRepository from '../utils/BaseRepository.js';
import { sendEmail, admissionStatusTemplate } from '../services/email.service.js';

const repo = new BaseRepository(Admission);

// POST /admissions - Public. Submits a new online admission application.
export const submitAdmission = asyncHandler(async (req, res) => {
  const documents = (req.files || []).map((file) => ({
    name: file.originalname,
    url: file.path,
    publicId: file.filename
  }));

  const application = await Admission.create({ ...req.body, documents });

  new ApiResponse(
    201,
    { applicationNumber: application.applicationNumber },
    'Application submitted successfully. Save your application number to track its status.'
  ).send(res);
});

// GET /admissions/track/:applicationNumber - Public status tracking.
export const trackAdmission = asyncHandler(async (req, res) => {
  const application = await Admission.findOne({
    applicationNumber: req.params.applicationNumber
  }).select('studentName classAppliedFor status applicationNumber createdAt remarks');

  if (!application) throw ApiError.notFound('No application found with that number.');
  new ApiResponse(200, application, 'Application status fetched').send(res);
});

// GET /admissions - Admin only, paginated list with status filter/search.
export const listAdmissions = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search = '', status, sort = '-createdAt' } = req.query;
  const filter = status ? { status } : {};

  const { items, meta } = await repo.findPaginated({
    filter,
    search,
    searchFields: ['studentName', 'parentName', 'email', 'applicationNumber'],
    sort,
    page: Number(page),
    limit: Number(limit)
  });

  new ApiResponse(200, items, 'Admissions fetched', meta).send(res);
});

export const getAdmission = asyncHandler(async (req, res) => {
  const application = await repo.findById(req.params.id);
  if (!application) throw ApiError.notFound('Application not found');
  new ApiResponse(200, application, 'Application fetched').send(res);
});

/**
 * PATCH /admissions/:id/status - Admin approves/rejects/updates status,
 * and notifies the applicant by email.
 */
export const updateAdmissionStatus = asyncHandler(async (req, res) => {
  const { status, remarks } = req.body;

  const application = await Admission.findByIdAndUpdate(
    req.params.id,
    { status, remarks, reviewedBy: req.user._id },
    { new: true, runValidators: true }
  );
  if (!application) throw ApiError.notFound('Application not found');

  await sendEmail({
    to: application.email,
    subject: `Admission Application ${application.applicationNumber} - Status Update`,
    html: admissionStatusTemplate(application)
  });

  new ApiResponse(200, application, 'Admission status updated and applicant notified').send(res);
});

export const deleteAdmission = asyncHandler(async (req, res) => {
  const application = await repo.deleteById(req.params.id);
  if (!application) throw ApiError.notFound('Application not found');
  new ApiResponse(200, null, 'Application deleted').send(res);
});
