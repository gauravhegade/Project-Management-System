const { Subject, Group, Phase } = require('../models/Subject');

const createSubject = async (req, res) => {
  const {
    course_code,
    course_name,
    faculty_incharge_name,
    faculty_incharge_email,
    max_team_size,
    min_team_size,
    description,
    last_date,
  } = req.body;

  if (
    !course_code ||
    !course_name ||
    !faculty_incharge_email ||
    !faculty_incharge_name
  ) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const subject = await Subject.findOne({ course_code: course_code });
    if (subject) {
      return res.status(400).json({ error: 'Subject already exists' });
    }

    const newSubject = new Subject({
      course_code,
      course_name,
      faculty_incharge_name,
      faculty_incharge_email,
      max_team_size,
      min_team_size,
      description,
      last_date,
    });

    await newSubject.save();
    return res
      .status(201)
      .json({ message: 'Subject created successfully', subject: newSubject });
  } catch (error) {
    console.log('error: ', error);
    return res.status(500).json('Failed to create subject');
  }
};

const getSubjectDetails = async (req, res) => {
  const { course_code, email: faculty_email } = req.query;

  if (!course_code || !faculty_email) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const subject = await Subject.findOne({ course_code: course_code }).select('-groups');

    if (!subject) {
      return res.status(404).json({ error: 'Subject does not exist' });
    }

    if (subject.faculty_incharge_email !== faculty_email) {
      return res.status(403).json({ error: 'Unauthorized access' });
    }

    return res.status(200).json(subject);
  } catch (error) {
    console.log('Error: ', error);
    return res.status(500).json({ error: 'Failed to fetch subject details' });
  }
};

const addStudents = async (req, res) => {
  const { faculty_email, course_code, students } = req.body;

  if (!faculty_email || !course_code || !Array.isArray(students)) {
    return res.status(400).json({ error: 'Missing required fields or invalid students data' });
  }

  try {
    const subject = await Subject.findOne({ 
      course_code: course_code, 
      faculty_incharge_email: faculty_email 
    });

    if (!subject) {
      return res.status(404).json({ error: 'Subject not found or unauthorized access' });
    }

    // Add students to the subject's students array
    students.forEach(({ email, usn, student_name }) => {
      if (email && usn && student_name) {
        subject.students.push({ email, usn, name: student_name });
      }
    });

    await subject.save();

    res.status(200).json({ message: 'Students added successfully' });
  } catch (error) {
    console.log('Error: ', error);
    res.status(500).json({ error: 'Failed to add students' });
  }
};


const getListofSubjects = async (req, res) => {
  const { faculty_email } = req.body;

  if (!faculty_email) {
    return res.status(400).json({ error: 'Missing faculty_email' });
  }

  try {
    const subjects = await Subject.find(
      { faculty_incharge_email: faculty_email },
      { course_code: 1, course_name: 1, _id: 0 } 
    );

    if (!subjects || subjects.length === 0) {
      return res.status(404).json({ error: 'No subjects found for this faculty' });
    }

    return res.status(200).json(subjects);
  } catch (error) {
    console.log('Error: ', error);
    return res.status(500).json({ error: 'Failed to fetch subjects' });
  }
};

const modifySubject = async (req, res) => {
  const {
    course_code,
    course_name,
    faculty_incharge_name,
    faculty_incharge_email,
    max_team_size,
    min_team_size,
    description,
    last_date,
  } = req.body;

  if (
    !course_code ||
    !course_name ||
    !faculty_incharge_email ||
    !faculty_incharge_name
  ) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const updatedSubject = await Subject.findOneAndUpdate(
      { course_code: course_code },
      {
        course_name,
        faculty_incharge_name,
        faculty_incharge_email,
        max_team_size,
        min_team_size,
        description,
        last_date,
      },
      { new: true, fields: { groups: 0 } }
    );

    if (!updatedSubject) {
      return res.status(404).json({ error: 'Subject does not exist' });
    }

    return res.status(200).json({
      message: 'Subject updated successfully',
      subject: updatedSubject,
    });
  } catch (error) {
    console.log('error: ', error);
    return res.status(500).json({ error: 'Failed to update subject' });
  }
};

const getListofStudents = async (req, res) => {
  const { faculty_email, course_code } = req.body;

  if (!faculty_email || !course_code) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const subject = await Subject.findOne({ 
      course_code: course_code, 
      faculty_incharge_email: faculty_email 
    });

    if (!subject) {
      return res.status(404).json({ error: 'Subject not found or unauthorized access' });
    }

    return res.status(200).json(subject.students);
  } catch (error) {
    console.log('Error: ', error);
    res.status(500).json({ error: 'Failed to retrieve student list' });
  }
};

const editStudentMarks = async (req, res) => {
  const { faculty_email, course_code, usn, marks } = req.body;

  if (!faculty_email || !course_code || !usn || marks === undefined) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const subject = await Subject.findOne({ 
      course_code: course_code, 
      faculty_incharge_email: faculty_email 
    });

    if (!subject) {
      return res.status(404).json({ error: 'Subject not found or unauthorized access' });
    }

    const student = subject.students.find(student => student.usn === usn);

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    student.marks = marks;

    await subject.save();

    res.status(200).json({ message: 'Marks updated successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to update marks' });
  }
};


module.exports = { createSubject, getSubjectDetails, modifySubject, getListofSubjects, addStudents };
