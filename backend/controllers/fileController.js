const {Subject, Phase} = require('../models/Subject');

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
            files.forEach(file => {
                phase.files.push({
                    file_name: file.filename,
                    file_path: file.path,
                    uploadedAt: new Date()
                });
            });
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
    const { course_code, group_no, phase_no } = req.body;

    try {
        const subject = await Subject.findOne({ course_code });
        if (!subject) {
            return res.status(404).json({ error: "Subject not found" });
        }

        const group = subject.groups.find(group => group.group_no === group_no);
        if (!group) {
            return res.status(404).json({ error: "Group not found" });
        }

        const phase = group.phases.find(phase => phase.phase_no === phase_no);
        if (!phase) {
            return res.status(404).json({ error: "Phase not found" });
        }

        const fileNames = phase.files.map(file => file.file_name);
        res.status(200).json(fileNames);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { uploadFile, getListofFiles };
