const express = require('express');

// controller functions
const {
  signupStudent,
  loginStudent,
  signupFaculty,
  loginFaculty,
} = require('../controllers/userController');

const router = express.Router();

// login student route
router.post('/student/login', loginStudent);

// signup student route
router.post('/student/signup', signupStudent);

// login student route
router.post('/faculty/login', loginFaculty);

// signup student route
router.post('/faculty/signup', signupFaculty);

module.exports = router;
