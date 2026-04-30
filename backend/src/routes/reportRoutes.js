const express = require('express');
const router = express.Router();
const {
  getReports,
  getReport,
  createReport,
  updateReport,
  deleteReport
} = require('../controllers/reportController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // All routes protected

router.route('/')
  .get(getReports)
  .post(createReport);

router.route('/:id')
  .get(getReport)
  .patch(updateReport)
  .delete(deleteReport);

module.exports = router;
