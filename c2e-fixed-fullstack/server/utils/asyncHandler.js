// Wraps async route handlers/controllers so thrown errors are forwarded to
// the Express error-handling middleware instead of crashing the process.
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
