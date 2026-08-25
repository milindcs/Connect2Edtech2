const validator = require('validator');

const escapeHtml = (input) => {
  if (typeof input !== 'string') return input;
  return validator.escape(input);
};

const sanitizeObject = (obj, fields) => {
  const sanitized = { ...obj };
  for (const field of fields) {
    if (sanitized[field] !== undefined) {
      sanitized[field] = escapeHtml(sanitized[field]);
    }
  }
  return sanitized;
};

module.exports = { escapeHtml, sanitizeObject };
