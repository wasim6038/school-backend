import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken
} from '../utils/generateTokens.js';
import User from '../models/User.js';
import ApiError from '../utils/ApiError.js';

// Issues a fresh access + refresh token pair for a user.
export const issueTokenPair = (user) => ({
  accessToken: generateAccessToken(user),
  refreshToken: generateRefreshToken(user)
});

// Validates a refresh token cookie and issues a new access token.
// Used by POST /auth/refresh.
export const rotateAccessToken = async (refreshToken) => {
  if (!refreshToken) throw ApiError.unauthorized('No refresh token provided.');

  let decoded;
  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch {
    throw ApiError.unauthorized('Invalid or expired refresh token.');
  }

  const user = await User.findById(decoded.id);
  if (!user || !user.isActive) throw ApiError.unauthorized('User no longer active.');

  return { accessToken: generateAccessToken(user), user };
};
