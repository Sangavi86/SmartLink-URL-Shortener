const express = require('express');
const router = express.Router();
const { createShortUrl, getUserUrls, updateUrl, deleteUrl } = require('../controllers/urlController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createShortUrl);
router.get('/', protect, getUserUrls);
router.put('/:id', protect, updateUrl);
router.delete('/:id', protect, deleteUrl);

module.exports = router;
