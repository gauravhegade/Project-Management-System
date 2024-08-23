const express = require('express');
const router = express.Router();

const uploadMiddleware = require('../middleware/uploadMiddleware');
const fileController = require('../controllers/fileController');

router.post('/upload-files', uploadMiddleware.uploadFiles.array('doc'), fileController.uploadFile);
router.get('/get-list-of-files',fileController.getListofFiles);
router.get('/get-file',fileController.getFile);
router.delete('/delete-file',fileController.deleteFile);

module.exports = router;
