const { errorResponse } = require('../utils/responseHandler');
const { HTTP_STATUS, ERROR_MESSAGES } = require('../utils/constants');

// Global error handler middleware
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
  let message = err.message || ERROR_MESSAGES.INTERNAL_ERROR;
  let errors = null;

  // Log error in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', err);
    console.error('Stack:', err.stack);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    statusCode = HTTP_STATUS.BAD_REQUEST;
    message = 'Validation Error';
    errors = Object.values(err.errors).map(error => ({
      field: error.path,
      message: error.message
    }));
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    statusCode = HTTP_STATUS.CONFLICT;
    const field = Object.keys(err.keyValue)[0];
    message = `${field} already exists`;
    errors = [{
      field: field,
      message: `${field} '${err.keyValue[field]}' is already registered`
    }];
  }

  // Mongoose cast error (invalid ObjectId)
  if (err.name === 'CastError') {
    statusCode = HTTP_STATUS.BAD_REQUEST;
    message = `Invalid ${err.path}: ${err.value}`;
    errors = [{
      field: err.path,
      message: `Invalid ${err.path} format`
    }];
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = HTTP_STATUS.UNAUTHORIZED;
    message = ERROR_MESSAGES.INVALID_TOKEN;
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = HTTP_STATUS.UNAUTHORIZED;
    message = ERROR_MESSAGES.TOKEN_EXPIRED;
  }

  // Multer file upload errors
  if (err.name === 'MulterError') {
    statusCode = HTTP_STATUS.BAD_REQUEST;
    if (err.code === 'LIMIT_FILE_SIZE') {
      message = 'File size is too large';
    } else if (err.code === 'LIMIT_FILE_COUNT') {
      message = 'Too many files';
    } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      message = 'Unexpected field in form data';
    } else {
      message = err.message;
    }
  }

  // MongoDB connection errors
  if (err.name === 'MongoNetworkError' || err.name === 'MongoTimeoutError') {
    statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR;
    message = 'Database connection error';
  }

  // Syntax errors in JSON
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    statusCode = HTTP_STATUS.BAD_REQUEST;
    message = 'Invalid JSON in request body';
  }

  // Rate limit errors
  if (err.name === 'TooManyRequestsError') {
    statusCode = 429;
    message = 'Too many requests, please try again later';
  }

  // Send error response
  return errorResponse(res, statusCode, message, errors);
};

// Async error handler wrapper
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Not found error handler
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.statusCode = HTTP_STATUS.NOT_FOUND;
  next(error);
};

// Custom error class
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = {
  errorHandler,
  asyncHandler,
  notFound,
  AppError
};