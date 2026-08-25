const express = require('express');
const { body } = require('express-validator');
const {
  getCourses,
  getAllCoursesAdmin,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  setCourseStatus,
} = require('../controllers/courseController');
const { protect } = require('../middleware/authMiddleware');
const { courseImageUpload } = require('../config/multer');

const router = express.Router();

const courseValidation = [
  body('title').trim().notEmpty().withMessage('Course title is required'),
  body('category')
    .trim()
    .isIn(['technical', 'non-technical'])
    .withMessage('Category must be technical or non-technical'),
  body('department')
    .trim()
    .isIn([
      'Computer Science',
      'Mechanical Engineering',
      'Civil Engineering',
      'Electronics and Communication',
      'Non-Technical',
    ])
    .withMessage('Department is invalid'),
  body('description').trim().notEmpty().withMessage('Description is required'),
];

// Public
router.get('/', getCourses);

// Admin - must be declared before /:id to avoid route collision
router.get('/admin/all', protect, getAllCoursesAdmin);
router.post('/', protect, courseImageUpload.single('image'), courseValidation, createCourse);
router.put('/:id', protect, courseImageUpload.single('image'), updateCourse);
router.patch('/:id/status', protect, setCourseStatus);
router.delete('/:id', protect, deleteCourse);

// Public - single course (kept after admin routes)
router.get('/:id', getCourseById);

module.exports = router;
