const mongoose = require('mongoose')
const Schema = mongoose.Schema

const fileSchema = new Schema({
    file_name: { type: String, required: true },
    file_path: { type: String, required: true },
    uploadedAt: { type: Date, default: Date.now }
},{timestamps: true});

const phaseSchema = new Schema({
    phase_name: { type: String, required: true },
    phase_no:{ type: Number, required: true },
    files: [fileSchema]
},{timestamps: true});

const Phase = mongoose.model('Phase',phaseSchema);

module.exports = Phase