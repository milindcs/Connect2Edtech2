const mongoose = require('mongoose');

const trainerSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    city: { type: String, trim: true, default: '' },
    state: { type: String, trim: true, default: '' },
    currentCompany: { type: String, trim: true, default: '' },
    currentDesignation: { type: String, trim: true, default: '' },
    yearsOfExperience: { type: Number, default: 0, min: 0 },
    expertise: { type: [String], default: [] },
    bio: { type: String, trim: true, default: '' },
    linkedin: { type: String, trim: true, default: '' },
    github: { type: String, trim: true, default: '' },
    website: { type: String, trim: true, default: '' },
    image: { type: String, default: '' },
    courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
    status: {
      type: String,
      enum: ['Active', 'Inactive'],
      default: 'Active',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Trainer', trainerSchema);
