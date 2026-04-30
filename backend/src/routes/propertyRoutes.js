const express = require('express');
const {
  getProperties,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty,
  getMyListings,
} = require('../controllers/propertyController');

const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/').get(getProperties).post(protect, createProperty);
router.route('/my-listings').get(protect, getMyListings);
router
  .route('/:id')
  .get(getProperty)
  .put(protect, updateProperty)
  .delete(protect, deleteProperty);

module.exports = router;
