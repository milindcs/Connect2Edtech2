const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema(
  {
    // Student / applicant information
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    city: { type: String, default: '', trim: true },
    state: { type: String, default: '', trim: true },

    // Course reference (denormalized title + image for quick display)
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    courseTitle: { type: String, required: true, trim: true },
    courseImage: { type: String, default: '' },

    // Optional message from the student
    message: { type: String, default: '', trim: true },

    agreed: { type: Boolean, required: true },

    status: {
      type: String,
      enum: ['Pending', 'Enrolled', 'Rejected'],
      default: 'Pending',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Enrollment', enrollmentSchema);
