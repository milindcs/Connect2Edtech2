const asyncHandler = require('../utils/asyncHandler');
const Trainer = require('../models/Trainer');
const { deleteFromGridfs } = require('../utils/gridfs');

const getTrainers = asyncHandler(async (req, res) => {
  const { status, search, page = 1, limit = 20 } = req.query;
  const filter = {};
  if (status) filter.status = status;
  if (search) {
    const re = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    filter.$or = [
      { fullName: re },
      { email: re },
      { currentDesignation: re },
      { currentCompany: re },
      { expertise: re },
    ];
  }
  const skip = (Number(page) - 1) * Number(limit);
  const [data, total] = await Promise.all([
    Trainer.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    Trainer.countDocuments(filter),
  ]);
  res.json({
    success: true,
    count: data.length,
    total,
    page: Number(page),
    pages: Math.ceil(total / Number(limit)),
    data,
  });
});

const getTrainerById = asyncHandler(async (req, res) => {
  const trainer = await Trainer.findById(req.params.id);
  if (!trainer) {
    res.status(404);
    throw new Error('Trainer not found');
  }
  res.json({ success: true, data: trainer });
});

const createTrainer = asyncHandler(async (req, res) => {
  const { expertise, courses, ...rest } = req.body;
  const trainer = await Trainer.create({
    ...rest,
    expertise: expertise || [],
    courses: courses || [],
  });
  res.status(201).json({ success: true, data: trainer });
});

const updateTrainer = asyncHandler(async (req, res) => {
  const trainer = await Trainer.findById(req.params.id);
  if (!trainer) {
    res.status(404);
    throw new Error('Trainer not found');
  }
  const { expertise, courses, image, ...rest } = req.body;
  Object.assign(trainer, rest);
  if (expertise) trainer.expertise = expertise;
  if (courses) trainer.courses = courses;
  if (image) trainer.image = image;
  await trainer.save();
  res.json({ success: true, data: trainer });
});

const deleteTrainer = asyncHandler(async (req, res) => {
  const trainer = await Trainer.findByIdAndDelete(req.params.id);
  if (!trainer) {
    res.status(404);
    throw new Error('Trainer not found');
  }
  if (trainer.image && trainer.image.startsWith('/uploads/')) {
    const filename = trainer.image.split('/').pop();
    await deleteFromGridfs(filename, 'trainers').catch(() => {});
  }
  res.json({ success: true, message: 'Trainer deleted' });
});

module.exports = { getTrainers, getTrainerById, createTrainer, updateTrainer, deleteTrainer };
