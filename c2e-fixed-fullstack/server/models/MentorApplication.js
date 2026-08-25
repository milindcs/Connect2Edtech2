const mongoose = require('mongoose');

const mentorApplicationSchema = new mongoose.Schema(
  {
    // Personal Information
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },

    // Professional Information
    currentCompany: { type: String, required: true, trim: true },
    currentDesignation: { type: String, required: true, trim: true },
    yearsOfExperience: { type: Number, required: true, min: 0 },

    // Skills
    skills: { type: [String], default: [] },

    // Teaching Information
    coursesInterested: { type: [String], default: [] },
    previousTeachingExperience: { type: String, trim: true, default: '' },
    linkedin: { type: String, trim: true, default: '' },
    github: { type: String, trim: true, default: '' },
    portfolio: { type: String, trim: true, default: '' },

    // Resume
    resumePath: { type: String, required: true },
    resumeOriginalName: { type: String, default: '' },

    // Motivation
    motivation: { type: String, required: true, trim: true },

    // Availability
    availability: {
      type: [String],
      default: [],
      enum: ['Weekdays', 'Weekends', 'Remote', 'Hybrid', 'Offline'],
    },

    agreed: { type: Boolean, required: true },

    status: {
      type: String,
      enum: ['Pending', 'Accepted', 'Rejected'],
      default: 'Pending',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('MentorApplication', mentorApplicationSchema);
