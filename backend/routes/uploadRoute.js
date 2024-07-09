const express = require('express');
const router = express.Router();

const uploadMiddleware = require('../middleware/uploadMiddleware');
const fileController = require('../controllers/fileController');

router.post('/upload-files', uploadMiddleware.uploadFiles.array('doc'), fileController.uploadFile);
router.post('/get-file-list',fileController.getListofFiles);

module.exports = router;
