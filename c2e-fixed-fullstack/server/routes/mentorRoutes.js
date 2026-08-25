const express = require('express');
const { body } = require('express-validator');
const {
  createMentorApplication,
  getMentorApplications,
  getMentorApplicationById,
  updateMentorApplication,
  deleteMentorApplication,
  downloadResume,
} = require('../controllers/mentorController');
const { protect } = require('../middleware/authMiddleware');
const { resumeUpload } = require('../config/multer');

const router = express.Router();

const applicationValidation = [
  body('fullName').trim().notEmpty().withMessage('Full name is required'),
  body('email').isEmail().withMessage('A valid email is required'),
  body('phone').trim().notEmpty().withMessage('Phone number is required'),
  body('city').trim().notEmpty().withMessage('City is required'),
  body('state').trim().notEmpty().withMessage('State is required'),
  body('currentCompany').trim().notEmpty().withMessage('Current company is required'),
  body('currentDesignation').trim().notEmpty().withMessage('Current designation is required'),
  body('yearsOfExperience')
    .notEmpty()
    .withMessage('Years of experience is required')
    .isFloat({ min: 0 })
    .withMessage('Years of experience must be a positive number'),
  body('motivation').trim().notEmpty().withMessage('Motivation is required'),
  body('agreed')
    .custom((value) => value === 'true' || value === true)
    .withMessage('You must agree to the terms to submit an application'),
];

router.post('/', resumeUpload.single('resume'), applicationValidation, createMentorApplication);

router.get('/', protect, getMentorApplications);
router.get('/:id', protect, getMentorApplicationById);
router.get('/:id/resume', protect, downloadResume);
router.put('/:id', protect, updateMentorApplication);
router.delete('/:id', protect, deleteMentorApplication);

module.exports = router;
