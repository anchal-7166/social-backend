const ErrorHandler = require("../utils/ApiError");


// Centralized error handling middleware
const errorMiddleware = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || 'Internal Server Error';

  // Log error for debugging
  console.error('Error occurred:', {
    message: err.message,
    statusCode: err.statusCode,
    stack: err.stack,
    path: req.path,
    method: req.method
  });

  // Mongoose duplicate key error (11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
    err = new ErrorHandler(message, 400);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors)
      .map(val => val.message)
      .join(', ');
    err = new ErrorHandler(message, 400);
  }

  // Mongoose invalid ObjectId error
  if (err.name === 'CastError') {
    const message = `Invalid ${err.path}: ${err.value}`;
    err = new ErrorHandler(message, 400);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    err = new ErrorHandler('Invalid token. Please log in again.', 401);
  }

  if (err.name === 'TokenExpiredError') {
    err = new ErrorHandler('Your token has expired. Please log in again.', 401);
  }

  // Multer file upload errors
  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      err = new ErrorHandler('File size too large. Maximum size is 5MB', 400);
    } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      err = new ErrorHandler('Unexpected field in file upload', 400);
    } else {
      err = new ErrorHandler(`File upload error: ${err.message}`, 400);
    }
  }

  // Send error response
  res.status(err.statusCode).json({
    success: false,
    message: err.message,
    ...(process.env.NODE_ENV === 'development' && {
      error: err,
      stack: err.stack
    })
  });
};

// Async error handler wrapper
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = { errorMiddleware, asyncHandler };