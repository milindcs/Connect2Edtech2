const { validationResult } = require('express-validator');
const asyncHandler = require('../utils/asyncHandler');
const Gallery = require('../models/Gallery');
const { uploadToGridfs, deleteFromGridfs, buildFilename } = require('../utils/gridfs');

// @desc    Get all gallery images (public, ordered for display)
// @route   GET /api/gallery
// @route   GET /api/gallery?page=1&limit=20
// @access  Public
const getGalleryImages = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const [images, total] = await Promise.all([
    Gallery.find().sort({ order: 1, createdAt: -1 }).skip(skip).limit(limit),
    Gallery.countDocuments(),
  ]);

  res.json({
    success: true,
    count: images.length,
    total,
    page,
    pages: Math.ceil(total / limit),
    data: images,
  });
});

// @desc    Get single gallery image
// @route   GET /api/gallery/:id
// @access  Public
const getGalleryImageById = asyncHandler(async (req, res) => {
  const image = await Gallery.findById(req.params.id);
  if (!image) {
    res.status(404);
    throw new Error('Gallery image not found');
  }
  res.json({ success: true, data: image });
});

// @desc    Create a gallery image
// @route   POST /api/gallery
// @access  Private (Admin)
const createGalleryImage = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error(errors.array()[0].msg);
  }

  if (!req.file) {
    res.status(400);
    throw new Error('An image file is required');
  }

  const { title, description } = req.body;
  const filename = buildFilename(req.file.originalname);
  await uploadToGridfs(req.file.buffer, filename, 'gallery', req.file.mimetype);
  const image = `/uploads/gallery/${filename}`;

  // New items are appended to the end of the display order
  const lastItem = await Gallery.findOne().sort({ order: -1 });
  const order = lastItem ? lastItem.order + 1 : 0;

  const galleryItem = await Gallery.create({
    title,
    description: description || '',
    image,
    order,
  });

  res.status(201).json({ success: true, data: galleryItem });
});

// @desc    Update a gallery image (title, description, and/or replace image)
// @route   PUT /api/gallery/:id
// @access  Private (Admin)
const updateGalleryImage = asyncHandler(async (req, res) => {
  const galleryItem = await Gallery.findById(req.params.id);
  if (!galleryItem) {
    res.status(404);
    throw new Error('Gallery image not found');
  }

  const { title, description } = req.body;

  if (req.file) {
    if (galleryItem.image && galleryItem.image.startsWith('/uploads/')) {
      const oldFilename = galleryItem.image.split('/').pop();
      await deleteFromGridfs(oldFilename, 'gallery');
    }
    const filename = buildFilename(req.file.originalname);
    await uploadToGridfs(req.file.buffer, filename, 'gallery', req.file.mimetype);
    galleryItem.image = `/uploads/gallery/${filename}`;
  }

  if (title !== undefined) galleryItem.title = title;
  if (description !== undefined) galleryItem.description = description;

  const updated = await galleryItem.save();
  res.json({ success: true, data: updated });
});

// @desc    Delete a gallery image
// @route   DELETE /api/gallery/:id
// @access  Private (Admin)
const deleteGalleryImage = asyncHandler(async (req, res) => {
  const galleryItem = await Gallery.findById(req.params.id);
  if (!galleryItem) {
    res.status(404);
    throw new Error('Gallery image not found');
  }

  if (galleryItem.image && galleryItem.image.startsWith('/uploads/')) {
    const oldFilename = galleryItem.image.split('/').pop();
    await deleteFromGridfs(oldFilename, 'gallery');
  }

  await galleryItem.deleteOne();
  res.json({ success: true, message: 'Gallery image deleted' });
});

// @desc    Reorder gallery images (drag-and-drop in admin dashboard)
// @route   PATCH /api/gallery/reorder
// @access  Private (Admin)
const reorderGalleryImages = asyncHandler(async (req, res) => {
  const { order } = req.body; // array of gallery item ids in the new display order

  if (!Array.isArray(order) || order.length === 0) {
    res.status(400);
    throw new Error('An array of gallery image ids is required');
  }

  await Promise.all(
    order.map((id, index) => Gallery.findByIdAndUpdate(id, { order: index }))
  );

  const images = await Gallery.find().sort({ order: 1, createdAt: -1 });
  res.json({ success: true, data: images });
});

module.exports = {
  getGalleryImages,
  getGalleryImageById,
  createGalleryImage,
  updateGalleryImage,
  deleteGalleryImage,
  reorderGalleryImages,
};
