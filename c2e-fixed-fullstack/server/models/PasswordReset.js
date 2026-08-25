const mongoose = require('mongoose');
const crypto = require('crypto');

const passwordResetSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    token: {
      type: String,
      required: true,
      unique: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

// `token` is already indexed via `unique: true` above, so only the
// compound lookup index is declared here (avoids the duplicate-index warning).
passwordResetSchema.index({ email: 1, createdAt: -1 });

module.exports = mongoose.model('PasswordReset', passwordResetSchema);
