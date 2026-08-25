const express = require('express');
const { body } = require('express-validator');
const { loginAdmin, getMe, logoutAdmin } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('A valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  loginAdmin
);

router.get('/me', protect('Admin'), getMe);
router.post('/logout', protect('Admin'), logoutAdmin);

module.exports = router;
