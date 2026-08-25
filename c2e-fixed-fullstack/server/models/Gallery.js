const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '', trim: true },
    image: { type: String, required: true }, // stored path/URL
    order: { type: Number, default: 0 }, // controls display order (drag-and-drop)
  },
  { timestamps: true } // createdAt doubles as the upload date
);

module.exports = mongoose.model('Gallery', gallerySchema);
