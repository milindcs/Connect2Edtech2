const { validationResult } = require('express-validator');
const asyncHandler = require('../utils/asyncHandler');
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const { sanitizeObject } = require('../utils/sanitize');
const { sendEnrollmentNotification } = require('../services/mailer');

// @desc    Submit a course enrollment
// @route   POST /api/enrollment
// @access  Public
const createEnrollment = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error(errors.array()[0].msg);
  }

  const sanitized = sanitizeObject(req.body, ['fullName', 'email', 'phone', 'city', 'state', 'message']);
  const { courseId, fullName, email, phone, city, state, message, agreed } = sanitized;

  // Resolve the course and capture its title for display
  const course = await Course.findById(courseId);
  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }

  const enrollment = await Enrollment.create({
    course: course._id,
    courseTitle: course.title,
    courseImage: course.image || '',
    fullName,
    email,
    phone,
    city,
    state,
    message,
    agreed: agreed === 'true' || agreed === true,
  });

  // Notify the site owner by email. This never blocks or fails the
  // visitor's submission — errors are only logged server-side.
  sendEnrollmentNotification(enrollment).catch((err) =>
    console.error('[enrollment] notification email error:', err.message)
  );

  res.status(201).json({
    success: true,
    message: 'Your enrollment request has been submitted successfully!',
    data: enrollment,
  });
});

// @desc    Get all enrollments (with status filter, search + pagination)
// @route   GET /api/enrollment
// @route   GET /api/enrollment?status=Pending&search=john&page=1&limit=20
// @access  Private (Admin)
const getEnrollments = asyncHandler(async (req, res) => {
  const { status, search, page = 1, limit = 20 } = req.query;

  const filter = {};
  if (status) filter.status = status;
  if (search) {
    const re = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    filter.$or = [
      { fullName: re },
      { email: re },
      { phone: re },
      { courseTitle: re },
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);
  const [total, enrollments] = await Promise.all([
    Enrollment.countDocuments(filter),
    Enrollment.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
  ]);

  res.json({
    success: true,
    count: enrollments.length,
    total,
    page: Number(page),
    pages: Math.ceil(total / Number(limit)),
    data: enrollments,
  });
});

// @desc    Get single enrollment
// @route   GET /api/enrollment/:id
// @access  Private (Admin)
const getEnrollmentById = asyncHandler(async (req, res) => {
  const enrollment = await Enrollment.findById(req.params.id);
  if (!enrollment) {
    res.status(404);
    throw new Error('Enrollment not found');
  }
  res.json({ success: true, data: enrollment });
});

// @desc    Update enrollment status (Enroll / Reject)
// @route   PUT /api/enrollment/:id
// @access  Private (Admin)
const updateEnrollmentStatus = asyncHandler(async (req, res) => {
  const enrollment = await Enrollment.findById(req.params.id);
  if (!enrollment) {
    res.status(404);
    throw new Error('Enrollment not found');
  }

  const { status } = req.body;
  if (status && !['Pending', 'Enrolled', 'Rejected'].includes(status)) {
    res.status(400);
    throw new Error('Status must be Pending, Enrolled, or Rejected');
  }

  if (status) enrollment.status = status;
  await enrollment.save();

  res.json({ success: true, data: enrollment });
});

// @desc    Delete an enrollment
// @route   DELETE /api/enrollment/:id
// @access  Private (Admin)
const deleteEnrollment = asyncHandler(async (req, res) => {
  const enrollment = await Enrollment.findById(req.params.id);
  if (!enrollment) {
    res.status(404);
    throw new Error('Enrollment not found');
  }

  await enrollment.deleteOne();
  res.json({ success: true, message: 'Enrollment deleted' });
});

module.exports = {
  createEnrollment,
  getEnrollments,
  getEnrollmentById,
  updateEnrollmentStatus,
  deleteEnrollment,
};
