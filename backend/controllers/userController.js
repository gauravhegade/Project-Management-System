const User = require('../models/User');

// login student
const loginStudent = async (req, res) => {
  res.json({ msg: `Login Student` });
};

// signup student
const signupStudent = async (req, res) => {
  // destructuring the request object
  const { email, password } = req.body;

  try {
    const user = await User.signup(email, password);
    res.status(200).json({ email, user });
  } catch (error) {
    // catch the error we're throwing in the model
    res.status(400).json({ error: error.message });
  }
};

// login faculty
const loginFaculty = async (req, res) => {
  res.json({ msg: `Login Faculty` });
};

// signup faculty
const signupFaculty = async (req, res) => {
  // destructuring the request object
  const { email, password } = req.body;

  try {
    const user = await User.signup(email, password);
    res.status(200).json({ email, user });
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
