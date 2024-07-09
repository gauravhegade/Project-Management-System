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
  const course_code = req.query.course_code;

  if (!course_code) {
    return res.status(400).json({ error: 'Missing required field' });
  }

  try {
    const subject = await Subject.findOne({ course_code: course_code }).select(
      '-groups'
    );
    if (!subject) {
      return res.status(404).json({ error: 'Subject does not exist' });
    }
    return res.status(200).json(subject);
  } catch (error) {
    console.log('error: ', error);
    return res.status(500).json({ error: 'Failed to fetch subject details' });
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

module.exports = { createSubject, getSubjectDetails, modifySubject };
