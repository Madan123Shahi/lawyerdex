const { ZodError } = require('zod');
const { AppError } = require('../utils/appError');

/**
 * Handle Mongoose CastError (invalid ObjectId)
 */
const handleCastErrorDB = (err) =>
  new AppError(`Invalid ${err.path}: ${err.value}`, 400);

/**
 * Handle Mongoose duplicate key error
 */
const handleDuplicateFieldsDB = (err) => {
  const field = Object.keys(err.keyValue)[0];
  const value = err.keyValue[field];
  return new AppError(`Duplicate field value: "${value}" for field "${field}". Please use a different value.`, 400);
};

/**
 * Handle Mongoose validation error
 */
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  return new AppError(`Invalid input data: ${errors.join('. ')}`, 400);
};

/**
 * Handle JWT errors
 */
const handleJWTError = () => new AppError('Invalid token. Please log in again.', 401);
const handleJWTExpiredError = () => new AppError('Your session has expired. Please log in again.', 401);

/**
 * Handle Zod validation errors — converts ZodError into a user-friendly format
 */
const handleZodError = (err) => {
  const errors = err.errors.map((e) => ({
    field: e.path.join('.'),
    message: e.message,
  }));
  return new AppError('Validation failed', 422, errors);
};

/**
 * Development error response: includes full stack trace
 */
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    success: false,
    status: err.status,
    message: err.message,
    errors: err.errors || null,
    stack: err.stack,
    error: err,
  });
};

/**
 * Production error response: only expose operational errors to client
 */
const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      success: false,
      status: err.status,
      message: err.message,
      errors: err.errors || null,
    });
  } else {
    // Programming or unknown error — don't leak details
    console.error('💥 UNHANDLED ERROR:', err);
    res.status(500).json({
      success: false,
      status: 'error',
      message: 'Something went wrong. Please try again later.',
    });
  }
};

/**
 * Centralized Error Handler Middleware
 * This is the SINGLE place all errors flow to.
 */
const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    // In development, return all error details
    let error = err;
    if (err instanceof ZodError) error = handleZodError(err);
    sendErrorDev(error, res);
  } else {
    // In production, transform known error types
    let error = { ...err, message: err.message, name: err.name };

    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();
    if (err instanceof ZodError) error = handleZodError(err);

    sendErrorProd(error, res);
  }
};

/**
 * 404 Not Found handler — placed before errorHandler in app.js
 */
const notFound = (req, res, next) => {
  next(new AppError(`Route ${req.originalUrl} not found`, 404));
};

module.exports = { errorHandler, notFound };
