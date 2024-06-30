const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const validator = require('validator');

const Schema = mongoose.Schema;

const studentSchema = new Schema({
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

const facultySchema = new Schema({
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

// custom validators
const isStudentEmail = (email) => {
  return /^[a-z]+\.(ai|as|bt|ch|cs|cv|ec|ee|ei|et|im|is|me)\d{2}@rvce\.edu\.in$/.test(
    email
  );
};

const isFacultyEmail = (email) => {
  return /^[a-z]+@rvce\.edu\.in$/.test(email);
};

// static signup method
studentSchema.statics.signup = async (email, password) => {
  // validation
  if (!email || !password) {
    throw Error('All fields are required!');
  }

  if (!isStudentEmail(email)) {
    throw Error('Invalid email format!');
  }

  // password validation
  if (!validator.isStrongPassword(password)) {
    throw Error('Password not strong enough!');
  }

  // findOne returns a value, means same email already exists
  const exists = await Student.findOne({ email });

  if (exists) {
    throw Error('Email already in use!');
  }

  // default value is 10 for number of salt rounds
  // this strikes an optimal balance between security and speed
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  // create a user with their email and hashed password
  // DO NOT SAVE THE PASSWORD DIRECTLY
  const student = await Student.create({
    email,
    password: hash,
  });

  return student;
};

facultySchema.statics.signup = async (email, password) => {
  // validation
  if (!email || !password) {
    throw Error('All fields are required!');
  }

  if (!isFacultyEmail(email)) {
    throw Error('Invalid email format!');
  }

  // password validation
  if (!validator.isStrongPassword(password)) {
    throw Error('Password not strong enough!');
  }

  // findOne returns a value, means same email already exists
  const exists = await Faculty.findOne({ email });

  if (exists) {
    throw Error('Email already in use!');
  }

  // default value is 10 for number of salt rounds
  // this strikes an optimal balance between security and speed
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  // create a user with their email and hashed password
  // DO NOT SAVE THE PASSWORD DIRECTLY
  const faculty = await Faculty.create({
    email,
    password: hash,
  });

  return faculty;
};

const Student = mongoose.model('Student', studentSchema);
const Faculty = mongoose.model('Faculty', facultySchema);

module.exports = {
  Student,
  Faculty,
};
