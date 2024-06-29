const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Schema = mongoose.Schema;

/*
PERFORM VALIDATION CLIENT SIDE

    USE THE FOLLOWING REGEX FOR STUDENT VALIDATION

    /^[a-z]+\.(ai|as|bt|ch|cs|cv|ec|ee|ei|et|im|is|me)\d{2}@rvce\.edu\.in$/

    USE THE FOLLOWING REGEX FOR FACULTY VALIDATION

    /^[a-z]+@rvce\.edu\.in$/;

*/

const userSchema = new Schema({
  email: {
    type: String,
    required: [true, 'Email required!'],
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// static signup method
userSchema.statics.signup = async (email, password) => {
  // findOne returns a value, means same email already exists
  const exists = await User.findOne({ email });

  if (exists) {
    throw Error('Email already in use!');
  }

  // default value is 10 for number of salt rounds
  // this strikes an optimal balance between security and speed
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  // create a user with their email and hashed password
  // DO NOT SAVE THE PASSWORD DIRECTLY
  const user = await User.create({
    email,
    password: hash,
  });

  return user;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
