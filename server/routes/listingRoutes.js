const express = require('express');
const router = express.Router();
const {
  getListings,
  getListingById,
  createListing,
} = require('../controllers/listingController');

router.get('/', getListings);
router.get('/:id', getListingById);
router.post('/', createListing);

module.exports = router;
