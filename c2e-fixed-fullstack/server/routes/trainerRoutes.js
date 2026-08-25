const express = require('express');
const {
  getTrainers,
  getTrainerById,
  createTrainer,
  updateTrainer,
  deleteTrainer,
} = require('../controllers/trainerController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, getTrainers);
router.get('/:id', protect, getTrainerById);
router.post('/', protect, createTrainer);
router.put('/:id', protect, updateTrainer);
router.delete('/:id', protect, deleteTrainer);

module.exports = router;
