// middleware/asyncHandler.js
// Wraps async route functions to automatically pass errors to Express error handling middleware
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
