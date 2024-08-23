const {Subject, Phase} = require('../models/Subject');

const fs = require('fs');
const path = require('path');

const uploadFile = async (req, res) => {
    try {
        const files = req.files;
        if (!files || files.length === 0) {
            return res.status(400).json({ error: 'No files uploaded' });
        }

        const { course_code, phase_name } = req.body;
        const group_no = parseInt(req.body.group_no, 10);
        const phase_no = parseInt(req.body.phase_no, 10);

        const subject = await Subject.findOne({ course_code });
        if (!subject) {
            return res.status(404).json({ error: 'Subject not found' });
        }

        const group = subject.groups.find(group => group.group_no === group_no);
        if (!group) {
            return res.status(404).json({ error: 'Group not found' });
        }

        let phase = group.phases.find(phase => phase.phase_no === phase_no);

        if (!phase) {
            phase = new Phase({
                phase_name,
                phase_no,
                files: []
            });
        }

        files.forEach(file => {
            phase.files.push({
                original_name: file.originalname, // Save the original filename
                file_name: file.filename,         // Save the generated filename
                file_path: file.path,             // Save the file path
                uploadedAt: new Date()            // Save the upload timestamp
            });
        });

        if (!group.phases.includes(phase)) {
            group.phases.push(phase);
        }

        await subject.save();
        res.status(200).json({ message: 'Files uploaded successfully' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to upload files' });
    }
};

const getListofFiles = async (req, res) => {
    const { user_email, course_code, group_no, phase_no } = req.body;

    try {
        const subject = await Subject.findOne({ course_code });
        if (!subject) {
            return res.status(404).json({ error: "Subject not found" });
        }

        const isFaculty = subject.faculty_handler_email === user_email;

        // Find the group by group number
        const group = subject.groups.find(group => group.group_no === group_no);
        if (!group) {
            return res.status(404).json({ error: "Group not found" });
        }

        const isStudentInGroup = group.students.some(student => student.email === user_email);

        if (!isFaculty && !isStudentInGroup) {
            return res.status(403).json({ error: 'User not authorized to view files for this group' });
        }

        const phase = group.phases.find(phase => phase.phase_no === phase_no);
        if (!phase) {
            return res.status(404).json({ error: "Phase not found" });
        }

        // Extract file information
        const filesInfo = phase.files.map(file => ({
            original_name: file.original_name, 
            file_name: file.file_name,         
            uploadedAt: file.uploadedAt        
        }));

        res.status(200).json(filesInfo);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


const getFile = async (req, res) => {
    try {
        const { user_email, course_code, group_no, phase_no, file_name } = req.body;

        const subject = await Subject.findOne({ course_code });
        if (!subject) {
            return res.status(404).json({ message: 'Subject not found' });
        }

        const isFacultyInCharge = subject.faculty_incharge_email === user_email;
        const group = subject.groups.find(g => g.group_no === group_no);

        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        const isMember = group.members.some(member => member.email === user_email);

        if (!isFacultyInCharge && !isMember) {
            return res.status(403).json({ message: 'You are not authorized to access this file' });
        }

        const phase = group.phases.find(p => p.phase_no === phase_no);
        if (!phase) {
            return res.status(404).json({ message: 'Phase not found' });
        }

        const file = phase.files.find(f => f.file_name === file_name);
        if (!file) {
            return res.status(404).json({ message: 'File not found' });
        }

        return res.status(200).json({ file });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const deleteFile = async (req, res) => {
    const { course_code, group_no, phase_no, file_name, user_email } = req.body;

    try {
        const subject = await Subject.findOne({ course_code });
        if (!subject) {
            return res.status(404).json({ error: 'Subject not found' });
        }

        const group = subject.groups.find(group => group.group_no === group_no);
        if (!group) {
            return res.status(404).json({ error: 'Group not found' });
        }

        const userInGroup = group.students.some(student => student.email === user_email);
        if (!userInGroup) {
            return res.status(403).json({ error: 'User not authorized to delete files for this group' });
        }

        const phase = group.phases.find(phase => phase.phase_no === phase_no);
        if (!phase) {
            return res.status(404).json({ error: 'Phase not found' });
        }

        // Find the file within the phase
        const fileIndex = phase.files.findIndex(file => file.file_name === file_name);
        if (fileIndex === -1) {
            return res.status(404).json({ error: 'File not found' });
        }

        // Get the file path
        const filePath = phase.files[fileIndex].file_path;

        // Remove the file from the phase's files array
        phase.files.splice(fileIndex, 1);

        // Save the updated subject
        await subject.save();

        // Delete the file from local storage
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error('Error deleting file:', err);
                return res.status(500).json({ error: 'Failed to delete file from server' });
            }

            res.status(200).json({ message: 'File deleted successfully' });
        });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to delete file' });
    }
};


module.exports = { uploadFile, getListofFiles, deleteFile, getFile};
