const express = require('express');
const { body } = require('express-validator');
const { createTrainerApplication } = require('../controllers/trainerApplicationController');
const { apiLimiter } = require('../middleware/rateLimitMiddleware');

const router = express.Router();

const trainerValidation = [
  body('fullName').trim().notEmpty().withMessage('Full name is required'),
  body('email').isEmail().normalizeEmail().withMessage('A valid email is required'),
  body('phone').trim().notEmpty().withMessage('Phone number is required'),
  body('expertise').optional(),
  body('yearsOfExperience').trim().notEmpty().withMessage('Years of experience is required'),
  body('qualification').trim().notEmpty().withMessage('Qualification is required'),
  body('about').trim().optional({ checkFalsy: true }),
];

router.post('/', apiLimiter, trainerValidation, createTrainerApplication);

module.exports = router;
