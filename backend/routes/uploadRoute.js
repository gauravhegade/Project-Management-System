const express = require('express');
const router = express.Router();
const uploadMiddleware = require('../middleware/uploadMiddleware');
const uploadController = require('../controllers/uploadController');

router.post('/upload-files', uploadMiddleware.uploadFiles.array('files'), uploadController.uploadFile);

module.exports = router;
