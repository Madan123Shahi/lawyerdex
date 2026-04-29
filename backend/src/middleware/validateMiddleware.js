const { ZodError } = require('zod');
const { AppError } = require('../utils/appError');

/**
 * validate middleware — validates req.body against a Zod schema.
 * On failure, throws a ZodError which is caught by the centralized error handler.
 * On success, replaces req.body with the parsed (sanitized + coerced) data.
 */
const validate = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (err) {
    if (err instanceof ZodError) {
      return next(err); // forwarded to centralized errorHandler
    }
    next(new AppError('Validation error', 400));
  }
};

/**
 * validateQuery — same as validate but for req.query
 */
const validateQuery = (schema) => (req, res, next) => {
  try {
    req.query = schema.parse(req.query);
    next();
  } catch (err) {
    if (err instanceof ZodError) {
      return next(err);
    }
    next(new AppError('Query validation error', 400));
  }
};

module.exports = { validate, validateQuery };
