const path = require('path');
const multer = require('multer');

const fileStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads');
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        const filename = `${Date.now()}-${path.basename(file.originalname, ext)}${ext}`;
        cb(null, filename);
    }
});

const uploadFiles = multer({ storage: fileStorage });

module.exports = { uploadFiles };
