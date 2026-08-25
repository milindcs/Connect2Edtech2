const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    interestedCourse: { type: String, trim: true, default: '' },
    message: { type: String, required: true, trim: true },
  },
  { timestamps: { createdAt: 'createdDate', updatedAt: true } }
);

module.exports = mongoose.model('Contact', contactSchema);
