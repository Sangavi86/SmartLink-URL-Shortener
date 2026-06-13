/**
 * Centralized Express error-handling middleware.
 *
 * Catches all errors forwarded via next(err) and returns a
 * consistent { success, message } JSON response with the
 * appropriate HTTP status code.
 */
const errorHandler = (err, req, res, next) => {
  // Clone status / message so we can mutate safely
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // ── Mongoose ValidationError (e.g. required fields, enum) ──
  if (err.name === 'ValidationError') {
    statusCode = 400;
    const fieldMessages = Object.values(err.errors).map((e) => e.message);
    message = fieldMessages.join(', ');
  }

  // ── Mongoose CastError (invalid ObjectId, etc.) ──
  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid resource ID';
  }

  // ── MongoDB duplicate-key error ──
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    message = `Duplicate value for "${field}"`;
  }

  // ── JWT errors ──
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired, please login again';
  }

  // ── Multer file-upload errors ──
  if (err.name === 'MulterError') {
    statusCode = 400;
    message = err.message; // Multer already provides descriptive messages
  }

  // ── Log the error ──
  console.error(err);

  // ── Build response ──
  const response = {
    success: false,
    message,
  };

  if (process.env.NODE_ENV !== 'production') {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

module.exports = errorHandler;
