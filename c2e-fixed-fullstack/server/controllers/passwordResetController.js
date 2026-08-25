const { validationResult } = require('express-validator');
const crypto = require('crypto');
const asyncHandler = require('../utils/asyncHandler');
const User = require('../models/User');
const PasswordReset = require('../models/PasswordReset');

const generateResetToken = () => crypto.randomBytes(32).toString('hex');

// @desc    Request password reset
// @route   POST /api/auth/user/forgot-password
// @access  Public
const forgotPassword = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error(errors.array()[0].msg);
  }

  const { email } = req.body;
  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    return res.json({
      success: true,
      message: 'If an account with that email exists, a reset link has been sent.',
    });
  }

  const token = generateResetToken();
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

  await PasswordReset.create({
    email: user.email,
    token,
    expiresAt,
  });

  res.json({
    success: true,
    message: 'If an account with that email exists, a reset link has been sent.',
    // In production, send an email here. For now, return the token for testing.
    resetToken: token,
  });
});

// @desc    Reset password with token
// @route   POST /api/auth/user/reset-password
// @access  Public
const resetPassword = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error(errors.array()[0].msg);
  }

  const { token, password } = req.body;

  const resetRecord = await PasswordReset.findOne({ token });

  if (!resetRecord) {
    res.status(400);
    throw new Error('Invalid or expired reset token');
  }

  if (new Date() > resetRecord.expiresAt) {
    await resetRecord.deleteOne();
    res.status(400);
    throw new Error('Reset token has expired');
  }

  const user = await User.findOne({ email: resetRecord.email }).select('+password');
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user.password = password;
  await user.save();
  await resetRecord.deleteOne();

  res.json({ success: true, message: 'Password reset successful' });
});

module.exports = { forgotPassword, resetPassword };
