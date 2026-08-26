const { validationResult } = require('express-validator');
const asyncHandler = require('../utils/asyncHandler');
const TrainerApplication = require('../models/TrainerApplication');
const { sanitizeObject } = require('../utils/sanitize');
const { sendTrainerApplicationNotification, sendTrainerAcknowledgement } = require('../services/mailer');

const createTrainerApplication = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error(errors.array()[0].msg);
  }

  const sanitized = sanitizeObject(req.body, ['fullName', 'email', 'phone', 'qualification', 'about']);
  const {
    fullName,
    email,
    phone,
    expertise,
    yearsOfExperience,
    qualification,
    about,
  } = sanitized;

  let expertiseArray = [];
  if (expertise) {
    try {
      expertiseArray = JSON.parse(expertise);
      if (!Array.isArray(expertiseArray)) expertiseArray = [expertise];
    } catch (e) {
      expertiseArray = String(expertise).split(',').map((s) => s.trim()).filter(Boolean);
    }
  }

  const application = await TrainerApplication.create({
    fullName,
    email,
    phone,
    expertise: expertiseArray,
    yearsOfExperience: yearsOfExperience || undefined,
    qualification: qualification || '',
    about: about || '',
  });

  sendTrainerApplicationNotification(application).catch((err) =>
    console.error('[trainer] admin notification email error:', err.message)
  );

  sendTrainerAcknowledgement(application).catch((err) =>
    console.error('[trainer] acknowledgement email error:', err.message)
  );

  res.status(201).json({
    success: true,
    message: 'Your trainer application has been submitted successfully! Please check your email for confirmation.',
    data: application,
  });
});

module.exports = { createTrainerApplication };
