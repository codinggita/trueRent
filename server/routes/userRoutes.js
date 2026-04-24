const express = require('express');
const router = express.Router();
const { getSaved, saveListing } = require('../controllers/userController');

router.get('/saved', getSaved);
router.post('/save', saveListing);

module.exports = router;
