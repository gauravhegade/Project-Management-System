const { Subject } = require('../models/Subject');
const axios = require('axios');

const getGroupCount = async (course_code) => {
  try {
    const subject = await Subject.findOne({ course_code });
    if (subject && subject.groups) {
      return subject.groups.length;
    }
    return 0;
  } catch (error) {
    console.error('Error fetching group count:', error);
    throw new Error('Failed to fetch group count');
  }
};

const createGroup = async (req, res) => {
  const { course_code, title, members, project_description } = req.body;

  if (!course_code) {
    console.log('Missing course_code');
    return res.status(400).json({ error: 'Missing course_code' });
  }
  if (!title) {
    console.log('Missing title');
    return res.status(400).json({ error: 'Missing title' });
  }
  if (!Array.isArray(members)) {
    console.log('Members is not an array or missing');
    return res.status(400).json({ error: 'Missing or invalid members' });
  }

  if (!members.every((member) => member.email && member.name && member.usn)) {
    console.log('Invalid member info', members);
    return res.status(400).json({ error: 'Invalid member info' });
  }

  try {
    const subject = await Subject.findOne({ course_code });

    if (!subject) {
      console.log('Subject not found for course_code:', course_code);
      return res.status(404).json({ error: 'Subject not found' });
    }

    const studentEmails = subject.students.map(student => student.email);
    const unauthorizedMembers = members.filter(member => !studentEmails.includes(member.email));

    if (unauthorizedMembers.length > 0) {
      console.log('Unauthorized members:', unauthorizedMembers);
      return res.status(403).json({ error: 'You do not have access to create a group in this subject' });
    }

    if (title.length < 3 || title.length > 80) {
      console.log('Invalid title length:', title.length);
      return res.status(400).json({ error: 'Invalid title length' });
    }

    const team_size = members.length;
    if (team_size > subject.max_team_size || team_size < subject.min_team_size) {
      console.log('Invalid team size:', team_size);
      return res.status(400).json({ error: 'Invalid team size' });
    }

    const groupCount = await getGroupCount(course_code);
    const group_no = groupCount + 1;

    const group_info = {
      group_no, 
      title,
      members,
      project_description: project_description || ' ',
    };

    subject.groups.push(group_info);
    await subject.save();

    res.status(201).json({ message: 'Group created successfully' });
  } catch (error) {
    console.log('Error creating group:', error);
    res.status(500).json({ error: 'Failed to create group' });
  }
};

const addTeamMember = async (req, res) => {
  const { course_code, name, usn, email, user_email } = req.body;

  try {
    const subject = await Subject.findOne({ course_code: course_code });
    if (!subject) {
      return res.status(404).json({ error: 'Subject not found' });
    }

    const group = subject.groups.find((group) =>
      group.members.some((member) => member.email === user_email)
    );

    if (!group) {
      return res
        .status(404)
        .json({ error: 'Group not found for the specified user' });
    }

    if (group.members.length >= subject.max_team_size) {
      return res.status(400).json({ error: 'Group is already full' });
    }

    const existingMember = group.members.find((member) => member.email === email);
    if (existingMember) {
      return res
        .status(400)
        .json({ error: 'Member with this email already exists in the group' });
    }

    group.members.push({ name, usn, email });
    await subject.save();

    res.status(200).json({ message: 'Team member added successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to add team member' });
  }
};

const removeTeamMember = async (req, res) => {
  const { course_code, email, user_email } = req.body;

  if (!course_code || !email || !user_email) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const subject = await Subject.findOne({ course_code: course_code });

    if (!subject) {
      return res.status(404).json({ error: 'Subject not found' });
    }

    const group = subject.groups.find((group) =>
      group.members.some((member) => member.email === user_email)
    );

    if (!group) {
      return res
        .status(404)
        .json({ error: 'Group not found for the specified user' });
    }

    if (group.members.length <= subject.min_team_size) {
      return res.status(400).json({ error: 'Cannot remove member, group would be below minimum size' });
    }

    const memberIndex = group.members.findIndex(
      (member) => member.email === email
    );

    if (memberIndex === -1) {
      return res.status(404).json({ error: 'Member not found in the group' });
    }

    group.members.splice(memberIndex, 1);
    await subject.save();

    res.status(200).json({ message: 'Team member removed successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to remove team member' });
  }
};

const getGroupDetails = async (req, res) => {
  const course_code = req.query.course_code;
  const group_no = parseInt(req.query.group_no, 10);

  if (!course_code || !group_no) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const subject = await Subject.findOne({ course_code: course_code });

    if (!subject) {
      return res.status(404).json({ error: 'Subject not found' });
    }

    const group = subject.groups.find((group) => group.group_no === group_no);

    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    res.status(200).json(group);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to fetch group details' });
  }
};

const changeTitle = async (req, res) => {
  const { course_code, user_email, title } = req.body;

  if (!user_email || !title || !course_code) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const subject = await Subject.findOne({ course_code: course_code });

    if (!subject) {
      return res.status(404).json({ error: 'Subject not found' });
    }

    const group = subject.groups.find((group) =>
      group.members.some((member) => member.email === user_email)
    );

    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    group.title = title;
    await subject.save();
    res.status(200).json({ message: 'Title changed successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to change the title' });
  }
};

const pythonServiceUrl =
  process.env.PYTHON_SERVICE_URL || 'http://127.0.0.1:5000';

const checkTopic = async (req, res) => {
  const { topic1, threshold = 0.7 } = req.body;

  if (!topic1) {
    return res.status(400).send({ error: 'Topic must be provided.' });
  }

  try {
    const subjects = await Subject.findOne({ course_code });

    const results = [];
    for (const subject of subjects) {
      for (const group of subject.groups) {
        console.log(`Requesting similarity for: "${topic1}", "${group.title}"`);
        const groupResponse = await axios.post(
          `${pythonServiceUrl}/similarity`,
          {
            topic1: topic1,
            topic2: group.title,
          }
        );
        console.log('Response from Python service:', groupResponse.data);
        const groupSimilarity = groupResponse.data.similarity;
        if (groupSimilarity >= threshold) {
          results.push({
            groupNo: group.group_no,
            title: group.title,
            similarity: groupSimilarity,
          });
        }
      }
    }

    res.send({ filteredTitles: results });
  } catch (error) {
    console.error('Error calculating similarity:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);
    }
    res.status(500).send({ error: 'Error calculating similarity' });
  }
};

module.exports = {
  createGroup,
  addTeamMember,
  removeTeamMember,
  getGroupDetails,
  changeTitle,
  checkTopic,
};
