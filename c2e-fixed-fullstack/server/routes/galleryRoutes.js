const express = require('express');
const { body } = require('express-validator');
const {
  getGalleryImages,
  getGalleryImageById,
  createGalleryImage,
  updateGalleryImage,
  deleteGalleryImage,
  reorderGalleryImages,
} = require('../controllers/galleryController');
const { protect } = require('../middleware/authMiddleware');
const { galleryImageUpload } = require('../config/multer');

const router = express.Router();

const galleryValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
];

// Public
router.get('/', getGalleryImages);

// Admin - must be declared before /:id to avoid route collision
router.patch('/reorder', protect, reorderGalleryImages);
router.post('/', protect, galleryImageUpload.single('image'), galleryValidation, createGalleryImage);
router.put('/:id', protect, galleryImageUpload.single('image'), updateGalleryImage);
router.delete('/:id', protect, deleteGalleryImage);

// Public - single gallery image (kept after admin routes)
router.get('/:id', getGalleryImageById);

module.exports = router;
