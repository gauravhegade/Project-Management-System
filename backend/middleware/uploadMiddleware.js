const fs = require('fs');
const path = require('path');
const multer = require('multer');

const fileStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        const { course_code, group_no, phase_no } = req.body;

        if (!course_code || !group_no || !phase_no) {
            return cb(new Error('Missing required parameters: course_code, group_no, or phase_no'));
        }

        const uploadDir = path.join(__dirname, '..', 'uploads', course_code, `group_${group_no}`, `phase_${phase_no}`);

        fs.mkdir(uploadDir, { recursive: true }, function (err) {
            if (err) {
                return cb(err);
            }
            cb(null, uploadDir);
        });
    },
    filename: function (req, file, cb) {
        const filename = `${Date.now()}-${file.originalname}`;
        cb(null, filename);
    }
});

const uploadFiles = multer({ storage: fileStorage });

module.exports = { uploadFiles };
