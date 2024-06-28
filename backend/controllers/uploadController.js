const Subject = require('../models/Subject');
const Phase = require('../models/Phase'); 

const uploadFile = async (req, res) => {
    try {
        const { course_code, group_no, phase_no, phase_name } = req.body;
        const files = req.files;

        if (!files || files.length === 0) {
            return res.status(400).json({ error: 'No files uploaded' });
        }

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
            group.phases.push(phase);
        }

        files.forEach(file => {
            phase.files.push({
                file_name: file.filename,
                file_path: file.path,
                uploadedAt: new Date()
            });
        });

        await subject.save();
        res.status(200).json({ message: 'Files uploaded successfully' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to upload files' });
    }
};

module.exports = { uploadFile };
