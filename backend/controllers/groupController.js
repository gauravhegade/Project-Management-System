const Subject = require('../models/Groups')

const getGroupCount = async (course_code) => {
    try {
        const subject = await Subject.findOne({ course_code: course_code });
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
    const course_code = req.body.course_code
    const title = req.body.title
    const members = req.body.members
    const project_description = req.body.project_description;

    if (!course_code || !title || !Array.isArray(members)) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!Array.isArray(members) || !members.every(member => member.email && member.name && member.usn)) {
        return res.status(400).json({ error: 'Invalid member info' });
    }

    const group_info = {
        title: title,
        members: members
    };
    if(project_description){
        group_info.project_description = project_description;
    }

    try {
        const group_count = await getGroupCount(course_code);
        group_info.group_no = group_count + 1;

        const subject = await Subject.findOne({ course_code: course_code })
        if (!subject) {
            return res.status(404).json({ error: 'Subject not found' });
        }

        if(!title || title.length<3 || title.length>80){
            return res.status(400).json({error: 'Invalid title'});
        }

        const team_size = members.length
        if(team_size>subject.max_team_size || team_size<subject.min_team_size){
            return res.status(400).json({error: 'Invalid team size'});
        }

        subject.groups.push(group_info);
        await subject.save();

        res.status(200).json({ message: 'Group created successfully' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to create group.' });
    }
}

const addTeamMember = async (req, res) => {
    const { course_code, name, usn, email, user_email } = req.body;

    if (!course_code || !name || !usn || !email || !user_email) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const subject = await Subject.findOne({ course_code: course_code });

        if (!subject) {
            return res.status(404).json({ error: 'Subject not found' });
        }

        const group = subject.groups.find(group => group.members.some(member => member.email === user_email));

        if (!group) {
            return res.status(404).json({ error: 'Group not found for the specified user' });
        }

        if(group.members.length===subject.max_team_size){
            return res.status(400).json({error: 'Group is already full'})
        }

        const existingMember = group.members.find(member => member.email === email);
        if (existingMember) {
            return res.status(400).json({ error: 'Member with this email already exists in the group' });
        }

        group.members.push({ name, usn, email });
        await subject.save();

        res.status(200).json({ message: 'Team member added successfully' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to add team member' });
    }
}


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

        const group = subject.groups.find(group => group.members.some(member => member.email === user_email));

        if (!group) {
            return res.status(404).json({ error: 'Group not found for the specified user' });
        }

        if(subject.min_team_size===group.members.length){
            return res.status(400).json({error:'Not enough members'})
        }

        const memberIndex = group.members.findIndex(member => member.email === email);

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
}

const getGroupDetails = async (req, res) => {
    const { course_code, group_no } = req.body;

    if (!course_code || !group_no) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const subject = await Subject.findOne({ course_code: course_code });

        if (!subject) {
            return res.status(404).json({ error: 'Subject not found' });
        }

        const group = subject.groups.find(group => group.group_no === group_no);

        if (!group) {
            return res.status(404).json({ error: 'Group not found' });
        }

        res.status(200).json(group);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to fetch group details' });
    }
}

const changeTitle = async (req, res) => {
    const {course_code, user_email, title} = req.body

    if(!user_email || !title || !course_code){
        return res.status(400).json({error: 'Missing required fields'})
    }

    try{
        const subject = await Subject.findOne({ course_code: course_code });

        if (!subject) {
            return res.status(404).json({ error: 'Subject not found' });
        }

        const group = subject.groups.find(group => group.members.some(member => member.email === user_email));

        if (!group) {
            return res.status(404).json({ error: 'Group not found' });
        }

        group.title = title;
        await subject.save();
        res.status(200).json({message: 'Title changed successfully'});
    }catch(error){
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to change the title' });
    }
}

module.exports = {createGroup, addTeamMember, removeTeamMember, getGroupDetails, changeTitle}