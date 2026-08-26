const { validationResult } = require('express-validator');
const asyncHandler = require('../utils/asyncHandler');
const Course = require('../models/Course');
const { uploadToGridfs, deleteFromGridfs, buildFilename } = require('../utils/gridfs');
const { coursesData } = require('../seed/coursesData');

const coursesDataWithStatus = coursesData.map((c) => ({ ...c, status: 'Active' }));

// @desc    Get all active courses (optionally filtered by category)
// @route   GET /api/courses
// @route   GET /api/courses?category=technical&page=1&limit=20
// @access  Public
const getCourses = asyncHandler(async (req, res) => {
  const filter = { status: 'Active' };
  if (req.query.category) {
    filter.category = req.query.category;
  }
  if (req.query.department) {
    filter.department = req.query.department;
  }

  let courses = coursesDataWithStatus.filter((c) => {
    let match = c.status === 'Active';
    if (filter.category && c.category !== filter.category) match = false;
    if (filter.department && c.department !== filter.department) match = false;
    return match;
  });

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;
  const skip = (page - 1) * limit;
  const total = courses.length;
  courses = courses.slice(skip, skip + limit);

  console.log(`[getCourses] Returning ${courses.length} courses (filter: ${JSON.stringify(filter)})`);
  res.json({
    success: true,
    count: courses.length,
    total,
    page,
    pages: Math.ceil(total / limit),
    data: courses,
  });
});

// @desc    Get all courses regardless of status (for admin dashboard, with search + pagination)
// @route   GET /api/courses/admin/all
// @route   GET /api/courses/admin/all?search=react&page=1&limit=20
// @access  Private (Admin)
const getAllCoursesAdmin = asyncHandler(async (req, res) => {
  try {
    const { search, page = 1, limit = 20 } = req.query;

    const filter = {};
    if (req.query.category) filter.category = req.query.category;
    if (req.query.department) filter.department = req.query.department;
    if (search) {
      const re = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      filter.$or = [{ title: re }, { department: re }, { description: re }];
    }

    const skip = (Number(page) - 1) * Number(limit);
    let total, courses;
    
    try {
      [total, courses] = await Promise.all([
        Course.countDocuments(filter),
        Course.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      ]);
    } catch (dbError) {
      console.error('[getAllCoursesAdmin] Database error:', dbError);
      return res.json({
        success: true,
        count: 0,
        total: 0,
        page: Number(page),
        pages: 0,
        data: [],
      });
    }

    res.json({
      success: true,
      count: courses.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      data: courses,
    });
  } catch (error) {
    console.error('[getAllCoursesAdmin] Error:', error);
    res.json({
      success: true,
      count: 0,
      total: 0,
      page: Number(req.query.page) || 1,
      pages: 0,
      data: [],
    });
  }
});

// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Public
const getCourseById = asyncHandler(async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }
    res.json({ success: true, data: course });
  } catch (error) {
    console.error('[getCourseById] Error:', error);
    res.status(404).json({ success: false, message: 'Course not found' });
  }
});

// @desc    Create a course
// @route   POST /api/courses
// @access  Private (Admin)
const createCourse = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error(errors.array()[0].msg);
  }

  const { title, category, department, description, status } = req.body;
  let image = req.body.image || '';

  if (req.file) {
    const filename = buildFilename(req.file.originalname);
    await uploadToGridfs(req.file.buffer, filename, 'courses', req.file.mimetype);
    image = `/uploads/courses/${filename}`;
  }

  const course = await Course.create({
    title,
    category,
    department,
    description,
    image,
    status: status || 'Active',
  });

  res.status(201).json({ success: true, data: course });
});

// @desc    Update a course
// @route   PUT /api/courses/:id
// @access  Private (Admin)
const updateCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }

  const { title, category, department, description, status } = req.body;

  if (req.file) {
    if (course.image && course.image.startsWith('/uploads/')) {
      const oldFilename = course.image.split('/').pop();
      await deleteFromGridfs(oldFilename, 'courses');
    }
    const filename = buildFilename(req.file.originalname);
    await uploadToGridfs(req.file.buffer, filename, 'courses', req.file.mimetype);
    course.image = `/uploads/courses/${filename}`;
  } else if (req.body.image !== undefined) {
    course.image = req.body.image;
  }

  if (title !== undefined) course.title = title;
  if (category !== undefined) course.category = category;
  if (department !== undefined) course.department = department;
  if (description !== undefined) course.description = description;
  if (status !== undefined) course.status = status;

  const updated = await course.save();
  res.json({ success: true, data: updated });
});

// @desc    Delete a course
// @route   DELETE /api/courses/:id
// @access  Private (Admin)
const deleteCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }

  if (course.image && course.image.startsWith('/uploads/')) {
    const oldFilename = course.image.split('/').pop();
    await deleteFromGridfs(oldFilename, 'courses');
  }

  await course.deleteOne();
  res.json({ success: true, message: 'Course deleted' });
});

// @desc    Toggle / set course status (Active / Inactive)
// @route   PATCH /api/courses/:id/status
// @access  Private (Admin)
const setCourseStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!['Active', 'Inactive'].includes(status)) {
    res.status(400);
    throw new Error('Status must be Active or Inactive');
  }

  const course = await Course.findById(req.params.id);
  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }

  course.status = status;
  await course.save();

  res.json({ success: true, data: course });
});

module.exports = {
  getCourses,
  getAllCoursesAdmin,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  setCourseStatus,
};
