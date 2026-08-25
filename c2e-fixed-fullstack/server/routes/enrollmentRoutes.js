const express = require('express');
const { body } = require('express-validator');
const {
  createEnrollment,
  getEnrollments,
  getEnrollmentById,
  updateEnrollmentStatus,
  deleteEnrollment,
} = require('../controllers/enrollmentController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

const enrollmentValidation = [
  body('courseId').isMongoId().withMessage('A valid course is required'),
  body('fullName').trim().notEmpty().withMessage('Full name is required'),
  body('email').isEmail().withMessage('A valid email is required'),
  body('phone').trim().notEmpty().withMessage('Phone number is required'),
  body('agreed')
    .custom((value) => value === 'true' || value === true)
    .withMessage('You must agree to the terms to enroll'),
];

// Public
router.post('/', enrollmentValidation, createEnrollment);

// Admin
router.get('/', protect, getEnrollments);
router.get('/:id', protect, getEnrollmentById);
router.put('/:id', protect, updateEnrollmentStatus);
router.delete('/:id', protect, deleteEnrollment);

module.exports = router;
