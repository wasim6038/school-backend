import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import { verifyAccessToken } from '../utils/generateTokens.js';
import User from '../models/User.js';

/**
 * Verifies the Bearer access token, loads the user, and attaches it to req.user.
 * Access tokens are sent in the Authorization header (not cookies) so the
 * refresh token remains the only httpOnly cookie in play.
 */
export const protect = asyncHandler(async (req, _res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw ApiError.unauthorized('Not authenticated. Please log in.');
  }

  const token = authHeader.split(' ')[1];

  let decoded;
  try {
    decoded = verifyAccessToken(token);
  } catch (err) {
    throw ApiError.unauthorized('Session expired or invalid token.');
  }

  const user = await User.findById(decoded.id);
  if (!user || !user.isActive) {
    throw ApiError.unauthorized('User no longer exists or is deactivated.');
  }

  req.user = user;
  next();
});
