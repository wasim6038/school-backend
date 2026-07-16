import logger from '../utils/logger.js';
import ApiError from '../utils/ApiError.js';

/**
 * Global centralized error handler. Normalizes Mongoose/JWT/Multer errors
 * into ApiError shape and never leaks stack traces in production.
 */
const errorMiddleware = (err, req, res, next) => {
  let error = err;

  if (!(error instanceof ApiError)) {
    let statusCode = error.statusCode || 500;
    let message = error.message || 'Internal Server Error';

    if (error.name === 'CastError') {
      statusCode = 400;
      message = `Invalid value for field "${error.path}"`;
    }
    if (error.code === 11000) {
      statusCode = 409;
      const field = Object.keys(error.keyValue || {})[0];
      message = `Duplicate value for field "${field}"`;
    }
    if (error.name === 'ValidationError') {
      statusCode = 400;
      message = Object.values(error.errors)
        .map((e) => e.message)
        .join(', ');
    }
    if (error.name === 'JsonWebTokenError') {
      statusCode = 401;
      message = 'Invalid token';
    }
    if (error.name === 'TokenExpiredError') {
      statusCode = 401;
      message = 'Token expired';
    }

    error = new ApiError(statusCode, message, error.errors || [], err.stack);
  }

  if (error.statusCode >= 500) {
    logger.error(`${req.method} ${req.originalUrl} - ${error.message}`, { stack: error.stack });
  } else {
    logger.warn(`${req.method} ${req.originalUrl} - ${error.message}`);
  }

  res.status(error.statusCode).json({
    success: false,
    statusCode: error.statusCode,
    message: error.message,
    errors: error.errors,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
};

export default errorMiddleware;
