const express = require('express');
const { getDashboardStats, getRecentDetails, getAnalytics } = require('../controllers/dashboardController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/test', protect(), (req, res) => {
  console.log('[DEBUG] Test route controller called');
  res.json({ success: true, message: 'Test passed' });
});

router.get('/stats', protect(), getDashboardStats);
router.get('/recent', protect(), getRecentDetails);
router.get('/analytics', protect(), getAnalytics);

module.exports = router;
