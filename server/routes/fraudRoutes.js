const express = require('express');
const router = express.Router();
const { analyzeListingFraud } = require('../controllers/fraudController');

router.post('/analyze', analyzeListingFraud);

module.exports = router;
