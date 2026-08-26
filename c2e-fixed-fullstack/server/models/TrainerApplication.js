const mongoose = require('mongoose');

const trainerApplicationSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    expertise: { type: [String], default: [] },
    yearsOfExperience: { type: String, trim: true },
    qualification: { type: String, trim: true, default: '' },
    about: { type: String, trim: true, default: '' },

    status: {
      type: String,
      enum: ['Pending', 'Reviewed', 'Accepted', 'Rejected'],
      default: 'Pending',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('TrainerApplication', trainerApplicationSchema);
