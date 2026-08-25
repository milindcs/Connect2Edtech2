const express = require('express');
const { body } = require('express-validator');
const {
  registerUser,
  loginUser,
  getMe,
  logoutUser,
} = require('../controllers/userAuthController');
const { forgotPassword, resetPassword } = require('../controllers/passwordResetController');
const { protect } = require('../middleware/authMiddleware');
const rateLimit = require('express-rate-limit');

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: 'Too many login attempts, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

const passwordComplexity = (value) => {
  if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value)) {
    throw new Error('Password must be at least 8 characters with uppercase, lowercase, number, and special character');
  }
  return true;
};

router.post(
  '/register',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('A valid email is required'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters')
      .custom(passwordComplexity),
  ],
  registerUser
);

router.post('/login', loginLimiter, [
  body('email').isEmail().withMessage('A valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
], loginUser);

router.post('/forgot-password', [
  body('email').isEmail().withMessage('A valid email is required'),
], forgotPassword);

router.post('/reset-password', [
  body('token').notEmpty().withMessage('Reset token is required'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .custom(passwordComplexity),
], resetPassword);

router.get('/me', protect('User'), getMe);
router.post('/logout', protect('User'), logoutUser);

module.exports = router;
