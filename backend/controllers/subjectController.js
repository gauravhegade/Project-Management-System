const Subject = require('../models/Groups')

const createSubject = async (req, res) => {
    const {
        course_code,
        course_name,
        faculty_incharge_name,
        faculty_incharge_email,
        max_team_size,
        min_team_size,
        description,
        last_date
    } = req.body

    if (!course_code || !course_name || !faculty_incharge_email || !faculty_incharge_name) {
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
            last_date
        })

        await newSubject.save();
        return res.status(201).json({ message: 'Subject created successfully', subject: newSubject });

    } catch (error) {
        console.log('error: ', error);
        return res.status(500).json('Failed to create subject');
    }
}

module.exports = {createSubject}
