const express = require('express');
const router = express.Router();
const {
  getOverview,
  getTrends,
  getRiskDistribution
} = require('../controllers/analyticsController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // All routes protected

router.get('/overview', getOverview);
router.get('/trends', getTrends);
router.get('/risk-distribution', getRiskDistribution);

module.exports = router;
