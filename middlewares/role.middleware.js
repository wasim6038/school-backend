import ApiError from '../utils/ApiError.js';

// Restricts a route to the given roles. Must run after `protect`.
const authorize = (...allowedRoles) => (req, _res, next) => {
  if (!req.user) {
    return next(ApiError.unauthorized('Not authenticated.'));
  }
  if (!allowedRoles.includes(req.user.role)) {
    return next(ApiError.forbidden('You do not have permission to perform this action.'));
  }
  next();
};

export default authorize;
