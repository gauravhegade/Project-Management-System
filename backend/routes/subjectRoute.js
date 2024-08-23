const express = require('express');
const router = express.Router();

const subjectController = require('../controllers/subjectController');

router.post('/create-subject', subjectController.createSubject);
router.get('/get-subject-details', subjectController.getSubjectDetails);
router.post('/modify-subject', subjectController.modifySubject);
router.post('/get-list-of-subjects',subjectController.getListofSubjects);
router.post('/add-students',subjectController.addStudents);
router.get('/get-list-of-students',subjectController.getListofStudents);
router.post('/update-student-marks',subjectController.updateStudentMarks);
router.post('/edit-student-marks',subjectController.editStudentMarks);

module.exports = router;
