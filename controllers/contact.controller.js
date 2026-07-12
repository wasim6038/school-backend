import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import ContactMessage from '../models/ContactMessage.js';
import BaseRepository from '../utils/BaseRepository.js';
import { sendEmail, contactFormTemplate } from '../services/email.service.js';

const repo = new BaseRepository(ContactMessage);

// POST /contact - Public. Saves the message and notifies the admin inbox
export const submitContactMessage = asyncHandler(async (req, res) => {
  const message = await ContactMessage.create(req.body);

  await sendEmail({
    to: process.env.ADMIN_NOTIFY_EMAIL,
    subject: `New Contact Message: ${req.body.subject || 'School Inquiry'}`,
    html: contactFormTemplate(req.body)
  });

  new ApiResponse(201, { id: message._id }, 'Your message has been sent. We will get back to you soon.').send(
    res
  );
});

export const listContactMessages = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search = '', status, sort = '-createdAt' } = req.query;
  const filter = status ? { status } : {};

  const { items, meta } = await repo.findPaginated({
    filter,
    search,
    searchFields: ['name', 'email', 'subject', 'message'],
    sort,
    page: Number(page),
    limit: Number(limit)
  });

  new ApiResponse(200, items, 'Contact messages fetched', meta).send(res);
});

export const updateMessageStatus = asyncHandler(async (req, res) => {
  const message = await repo.updateById(req.params.id, { status: req.body.status });
  if (!message) throw ApiError.notFound('Message not found');
  new ApiResponse(200, message, 'Message status updated').send(res);
});

export const deleteContactMessage = asyncHandler(async (req, res) => {
  const message = await repo.deleteById(req.params.id);
  if (!message) throw ApiError.notFound('Message not found');
  new ApiResponse(200, null, 'Message deleted').send(res);
});
