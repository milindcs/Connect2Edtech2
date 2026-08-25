const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: ['technical', 'non-technical'],
    },
    // Groups courses into the site's department sections (homepage
    // preview grids, department pages, admin filter). Kept separate from
    // `category` (technical / non-technical) so existing category-based
    // logic keeps working untouched.
    department: {
      type: String,
      required: true,
      enum: [
        'Computer Science',
        'Mechanical Engineering',
        'Civil Engineering',
        'Electronics and Communication',
        'Non-Technical',
      ],
    },
    description: { type: String, required: true, trim: true },
    image: { type: String, default: '' }, // stored path/URL
    status: {
      type: String,
      enum: ['Active', 'Inactive'],
      default: 'Active',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Course', courseSchema);
