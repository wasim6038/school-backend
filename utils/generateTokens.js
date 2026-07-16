import jwt from 'jsonwebtoken';

// Generates a short-lived access token carrying the user's id and role.
export const generateAccessToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRES || '15m'
  });

// Generates a long-lived refresh token carrying only the user's id.
//  Stored as an httpOnly cookie, never exposed to client-side JS.
export const generateRefreshToken = (user) =>
  jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES || '7d'
  });

export const verifyAccessToken = (token) => jwt.verify(token, process.env.JWT_ACCESS_SECRET);

export const verifyRefreshToken = (token) => jwt.verify(token, process.env.JWT_REFRESH_SECRET);

// Attaches the refresh token as a secure, httpOnly cookie on the response.
export const setRefreshTokenCookie = (res, token) => {
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });
};
