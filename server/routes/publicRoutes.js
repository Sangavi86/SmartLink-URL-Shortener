const express = require('express');
const router = express.Router();
const { getPublicStats } = require('../controllers/analyticsController');

// No auth middleware — fully public endpoint
router.get('/:shortCode', getPublicStats);

module.exports = router;
