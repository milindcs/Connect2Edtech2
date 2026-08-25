const jwt = require('jsonwebtoken');
const asyncHandler = require('../utils/asyncHandler');
const Admin = require('../models/Admin');
const User = require('../models/User');

// Protects routes - requires a valid JWT in the Authorization header
// Usage: protect('User') or protect('Admin') or protect() // defaults to Admin
const protect = (modelName = 'Admin') => {
  return asyncHandler(async (req, res, next) => {
    let token;

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }

    if (!token) {
      res.status(401);
      throw new Error('Not authorized, no token provided');
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const Model = modelName === 'User' ? User : Admin;
      const account = await Model.findById(decoded.id);

      if (!account) {
        res.status(401);
        throw new Error('Not authorized, account not found');
      }

      if (modelName === 'User') {
        req.user = account;
      } else {
        req.admin = account;
      }
      next();
    } catch (error) {
      res.status(401);
      throw new Error('Not authorized, invalid or expired token');
    }
  });
};

module.exports = { protect };
