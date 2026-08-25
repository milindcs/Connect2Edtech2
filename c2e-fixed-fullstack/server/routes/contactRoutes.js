const express = require('express');
const { body } = require('express-validator');
const { createContact, getContacts, deleteContact } = require('../controllers/contactController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post(
  '/',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('A valid email is required'),
    body('phone')
      .trim()
      .notEmpty()
      .withMessage('Phone number is required')
      .isLength({ min: 7, max: 20 })
      .withMessage('Phone number looks invalid'),
    body('message').trim().notEmpty().withMessage('Message is required'),
  ],
  createContact
);

router.get('/', protect, getContacts);
router.delete('/:id', protect, deleteContact);

module.exports = router;
