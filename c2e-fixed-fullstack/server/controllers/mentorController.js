const { validationResult } = require('express-validator');
const asyncHandler = require('../utils/asyncHandler');
const MentorApplication = require('../models/MentorApplication');
const { streamFromGridfs } = require('../utils/gridfs');
const { sanitizeObject } = require('../utils/sanitize');

const parseArrayField = (value) => {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string' && value.trim().length) {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed;
    } catch (e) {
      // fall back to comma separated string
      return value.split(',').map((v) => v.trim()).filter(Boolean);
    }
  }
  return [];
};

// @desc    Submit a mentor application
// @route   POST /api/mentor-application
// @access  Public
const createMentorApplication = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error(errors.array()[0].msg);
  }

  if (!req.file) {
    res.status(400);
    throw new Error('Resume file is required (PDF, DOC, or DOCX)');
  }

  const sanitized = sanitizeObject(req.body, [
    'fullName', 'email', 'phone', 'city', 'state',
    'currentCompany', 'currentDesignation', 'previousTeachingExperience',
    'linkedin', 'github', 'portfolio', 'motivation',
  ]);
  const {
    fullName,
    email,
    phone,
    city,
    state,
    currentCompany,
    currentDesignation,
    yearsOfExperience,
    previousTeachingExperience,
    linkedin,
    github,
    portfolio,
    motivation,
    agreed,
  } = sanitized;

  const resumeFilename = buildFilename(req.file.originalname);
  await uploadToGridfs(req.file.buffer, resumeFilename, 'resumes', req.file.mimetype);

  const application = await MentorApplication.create({
    fullName,
    email,
    phone,
    city,
    state,
    currentCompany,
    currentDesignation,
    yearsOfExperience,
    skills: parseArrayField(req.body.skills),
    coursesInterested: parseArrayField(req.body.coursesInterested),
    previousTeachingExperience,
    linkedin,
    github,
    portfolio,
    resumePath: `/uploads/resumes/${resumeFilename}`,
    resumeOriginalName: req.file.originalname,
    motivation,
    availability: parseArrayField(req.body.availability),
    agreed: agreed === 'true' || agreed === true,
  });

  res.status(201).json({
    success: true,
    message: 'Your mentor application has been submitted successfully!',
    data: application,
  });
});

// @desc    Get all mentor applications (with status filter, search + pagination)
// @route   GET /api/mentor-application
// @route   GET /api/mentor-application?status=Pending&search=john&page=1&limit=20
// @access  Private (Admin)
const getMentorApplications = asyncHandler(async (req, res) => {
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
      { skills: { $elemMatch: re } },
      { coursesInterested: { $elemMatch: re } },
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);
  const [total, applications] = await Promise.all([
    MentorApplication.countDocuments(filter),
    MentorApplication.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
  ]);

  res.json({
    success: true,
    count: applications.length,
    total,
    page: Number(page),
    pages: Math.ceil(total / Number(limit)),
    data: applications,
  });
});

// @desc    Get single mentor application
// @route   GET /api/mentor-application/:id
// @access  Private (Admin)
const getMentorApplicationById = asyncHandler(async (req, res) => {
  const application = await MentorApplication.findById(req.params.id);
  if (!application) {
    res.status(404);
    throw new Error('Mentor application not found');
  }
  res.json({ success: true, data: application });
});

// @desc    Update mentor application status (Accept / Reject)
// @route   PUT /api/mentor-application/:id
// @access  Private (Admin)
const updateMentorApplication = asyncHandler(async (req, res) => {
  const application = await MentorApplication.findById(req.params.id);
  if (!application) {
    res.status(404);
    throw new Error('Mentor application not found');
  }

  const { status } = req.body;
  if (status && !['Pending', 'Accepted', 'Rejected'].includes(status)) {
    res.status(400);
    throw new Error('Status must be Pending, Accepted, or Rejected');
  }

  if (status) application.status = status;
  await application.save();

  res.json({ success: true, data: application });
});

// @desc    Delete mentor application
// @route   DELETE /api/mentor-application/:id
// @access  Private (Admin)
const deleteMentorApplication = asyncHandler(async (req, res) => {
  const application = await MentorApplication.findById(req.params.id);
  if (!application) {
    res.status(404);
    throw new Error('Mentor application not found');
  }

  if (application.resumePath) {
    const resumeFilename = application.resumePath.split('/').pop();
    await deleteFromGridfs(resumeFilename, 'resumes');
  }

  await application.deleteOne();
  res.json({ success: true, message: 'Mentor application deleted' });
});

// @desc    Download a mentor's resume
// @route   GET /api/mentor-application/:id/resume
// @access  Private (Admin)
const downloadResume = asyncHandler(async (req, res) => {
  const application = await MentorApplication.findById(req.params.id);
  if (!application) {
    res.status(404);
    throw new Error('Mentor application not found');
  }

  const resumeFilename = application.resumePath.split('/').pop();
  const served = await streamFromGridfs(resumeFilename, 'resumes', res);
  if (!served) {
    res.status(404);
    throw new Error('Resume file not found on server');
  }
});

module.exports = {
  createMentorApplication,
  getMentorApplications,
  getMentorApplicationById,
  updateMentorApplication,
  deleteMentorApplication,
  downloadResume,
};
