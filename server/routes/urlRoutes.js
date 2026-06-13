const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

const { createShortUrl, getUserUrls, updateUrl, deleteUrl, bulkUploadUrls } = require('../controllers/urlController');
const { protect } = require('../middleware/authMiddleware');

router.post('/bulk-upload', protect, upload.single('file'), bulkUploadUrls);
router.post('/', protect, createShortUrl);
router.get('/', protect, getUserUrls);
router.put('/:id', protect, updateUrl);
router.delete('/:id', protect, deleteUrl);

module.exports = router;
