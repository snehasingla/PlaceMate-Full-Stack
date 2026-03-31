// middleware/errorMiddleware.js
// Global error handler — catches all errors thrown with next(error) in controllers
// Returns a consistent JSON error shape to the frontend

const errorHandler = (err, req, res, next) => {
  // If status code is still 200 (default), set it to 500
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    message: err.message,
    // Only show stack trace in development, not in production
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

// 404 handler — for routes that don't exist
const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  res.status(404);
  next(error);
};

module.exports = { errorHandler, notFound };
