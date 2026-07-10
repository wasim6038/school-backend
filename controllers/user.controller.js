import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import User from '../models/User.js';
import BaseRepository from '../utils/BaseRepository.js';

const repo = new BaseRepository(User);

// GET /users - super_admin, admin only
export const listUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search = '', sort = '-createdAt', role } = req.query;
  const filter = role ? { role } : {};

  const { items, meta } = await repo.findPaginated({
    filter,
    search,
    searchFields: ['name', 'email'],
    sort,
    page: Number(page),
    limit: Number(limit)
  });

  new ApiResponse(200, items, 'Users fetched', meta).send(res);
});

// POST /users - super_admin only, creates admin/editor accounts
export const createUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  const existing = await User.findOne({ email });
  if (existing) throw ApiError.conflict('A user with this email already exists.');

  // Only a super_admin may create another super_admin.
  const safeRole = role === 'super_admin' && req.user.role !== 'super_admin' ? 'editor' : role;

  const user = await User.create({ name, email, password, role: safeRole || 'editor' });
  new ApiResponse(201, user.toSafeObject(), 'User created successfully').send(res);
});

// PATCH /users/:id
export const updateUser = asyncHandler(async (req, res) => {
  const { name, role, isActive } = req.body;

  if (req.params.id === String(req.user._id) && isActive === false) {
    throw ApiError.badRequest('You cannot deactivate your own account.');
  }

  const user = await repo.updateById(req.params.id, { name, role, isActive });
  if (!user) throw ApiError.notFound('User not found');

  new ApiResponse(200, user.toSafeObject(), 'User updated successfully').send(res);
});

// DELETE /users/:id - super_admin only
export const deleteUser = asyncHandler(async (req, res) => {
  if (req.params.id === String(req.user._id)) {
    throw ApiError.badRequest('You cannot delete your own account.');
  }
  const user = await repo.deleteById(req.params.id);
  if (!user) throw ApiError.notFound('User not found');
  new ApiResponse(200, null, 'User deleted successfully').send(res);
});
