import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import User from '../models/User.js';
import { issueTokenPair, rotateAccessToken } from '../services/token.service.js';
import { setRefreshTokenCookie } from '../utils/generateTokens.js';

// validate user credentials and issue access and refresh tokens
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user || !user.isActive) {
    throw ApiError.unauthorized('Invalid email or password.');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw ApiError.unauthorized('Invalid email or password.');
  }

  const { accessToken, refreshToken } = issueTokenPair(user);
  setRefreshTokenCookie(res, refreshToken);

  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  new ApiResponse(200, { user: user.toSafeObject(), accessToken }, 'Login successful').send(res);
});

// Reads the httpOnly refresh cookie and issues a new access token.
export const refresh = asyncHandler(async (req, res) => {
  const { refreshToken } = req.cookies;
  const { accessToken, user } = await rotateAccessToken(refreshToken);
  new ApiResponse(200, { accessToken, user: user.toSafeObject() }, 'Token refreshed').send(res);
});

// Clears the refresh token cookie.
export const logout = asyncHandler(async (_req, res) => {
  res.clearCookie('refreshToken');
  new ApiResponse(200, null, 'Logged out successfully').send(res);
});

// Returns the currently authenticated user.
export const getMe = asyncHandler(async (req, res) => {
  new ApiResponse(200, req.user.toSafeObject(), 'Current user fetched').send(res);
});

// Allows a logged-in user to change their own password.
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id).select('+password');

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) throw ApiError.badRequest('Current password is incorrect.');

  user.password = newPassword;
  await user.save();

  new ApiResponse(200, null, 'Password updated successfully').send(res);
});
