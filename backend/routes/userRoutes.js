const express = require('express');
const {
  signupStudent,
  loginStudent,
  signupFaculty,
  loginFaculty,
} = require('../controllers/userController');

const router = express.Router();

// Signup and login routes for students and faculty
router.post('/student/signup', signupStudent);
router.post('/faculty/signup', signupFaculty);

router.post('/student/login', loginStudent);
router.post('/faculty/login', loginFaculty);

module.exports = router;
