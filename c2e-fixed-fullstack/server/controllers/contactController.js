const { validationResult } = require('express-validator');
const asyncHandler = require('../utils/asyncHandler');
const Contact = require('../models/Contact');
const { sanitizeObject } = require('../utils/sanitize');
const { sendContactNotification } = require('../services/mailer');

// @desc    Submit a contact us request
// @route   POST /api/contact
// @access  Public
const createContact = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error(errors.array()[0].msg);
  }

  // Honeypot spam protection: the "website" field is hidden from humans.
  // If it has a value the submission is from a bot — silently return success
  // (without saving) to avoid alerting the bot.
  if (req.body.website && req.body.website.trim().length > 0) {
    return res.status(200).json({
      success: true,
      message: 'Thank you! Your message has been received. We will get back to you soon.',
    });
  }

  const sanitized = sanitizeObject(req.body, ['name', 'email', 'phone', 'interestedCourse', 'message']);
  const { name, email, phone, interestedCourse, message } = sanitized;

  const contact = await Contact.create({
    name,
    email,
    phone,
    interestedCourse,
    message,
  });

  // Notify the site owner by email. This never blocks or fails the
  // visitor's submission — errors are only logged server-side.
  sendContactNotification(contact).catch((err) =>
    console.error('[contact] notification email error:', err.message)
  );

  res.status(201).json({
    success: true,
    message: 'Thank you! Your message has been received. We will get back to you soon.',
    data: contact,
  });
});

// @desc    Get all contact submissions (with search + pagination)
// @route   GET /api/contact
// @access  Private (Admin)
const getContacts = asyncHandler(async (req, res) => {
  const { search, page = 1, limit = 20 } = req.query;

  const filter = {};
  if (search) {
    const re = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    filter.$or = [{ name: re }, { email: re }, { message: re }];
  }

  const skip = (Number(page) - 1) * Number(limit);
  const [total, contacts] = await Promise.all([
    Contact.countDocuments(filter),
    Contact.find(filter).sort({ createdDate: -1 }).skip(skip).limit(Number(limit)),
  ]);

  res.json({
    success: true,
    count: contacts.length,
    total,
    page: Number(page),
    pages: Math.ceil(total / Number(limit)),
    data: contacts,
  });
});

// @desc    Delete a contact submission
// @route   DELETE /api/contact/:id
// @access  Private (Admin)
const deleteContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);

  if (!contact) {
    res.status(404);
    throw new Error('Contact request not found');
  }

  await contact.deleteOne();

  res.json({ success: true, message: 'Contact request deleted' });
});

module.exports = { createContact, getContacts, deleteContact };
