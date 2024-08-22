const { Student, Faculty } = require('../models/User');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const createToken = (_id) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
  }
  return jwt.sign({ _id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};
// login student
const loginStudent = async (req, res) => {
  const { email, password } = req.body;

  try {
    const student = await Student.login(email, password);

    // create a token
    const token = createToken(student._id);

    res.status(200).json({ email, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// signup student
const signupStudent = async (req, res) => {
  // destructuring the request object
  const { email, password } = req.body;

  try {
    const student = await Student.signup(email, password);

    // create a token
    const token = createToken(student._id);

    res.status(200).json({ email, token });
  } catch (error) {
    // catch the error we're throwing in the model
    res.status(400).json({ error: error.message });
  }
};

// login faculty
const loginFaculty = async (req, res) => {
  // destructuring the request object
  const { email, password } = req.body;

  try {
    const faculty = await Faculty.login(email, password);

    // create a token
    const token = createToken(faculty._id);

    res.status(200).json({ email, token });
  } catch (error) {
    // catch the error we're throwing in the model
    res.status(400).json({ error: error.message });
  }
};

// signup faculty
const signupFaculty = async (req, res) => {
  // destructuring the request object
  const { email, password } = req.body;

  try {
    const faculty = await Faculty.signup(email, password);

    // create a token
    const token = createToken(faculty._id);

    res.status(200).json({ email, token });
  } catch (error) {
    // catch the error we're throwing in the model
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  loginStudent,
  signupStudent,
  loginFaculty,
  signupFaculty,
};
