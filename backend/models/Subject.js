const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const memberSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    match: /.+\@.+\..+/,
  },
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 20,
  },
  usn: {
    type: String,
    required: true,
    unique: true,
  },
});

const fileSchema = new Schema(
  {
    file_name: { type: String, required: true },
    file_path: { type: String, required: true },
    uploadedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const phaseSchema = new Schema(
  {
    phase_name: { type: String, required: true },
    phase_no: { type: Number, required: true },
    files: [fileSchema],
  },
  { timestamps: true }
);

const groupSchema = new Schema(
  {
    group_no: {
      type: Number,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 80,
    },
    project_description: {
      type: String,
      required: true,
      minlength: 10,
      default: ' ',
    },
    members: [memberSchema],
    phases: [phaseSchema],
  },
  { timestamps: true }
);

const studentSchema = new Schema({
  email: String,
  usn: String,
  name: String,
  marks: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  }
});

const subjectSchema = new Schema(
  {
    course_name: String,
    course_code: String,
    faculty_incharge_name: String,
    faculty_incharge_email: String,
    students:[studentSchema],
    max_team_size: {
      type: Number,
      max: 10,
      min: 1,
      default: 4,
    },
    min_team_size: {
      type: Number,
      min: 1,
      max: 10,
      default: 2,
    },
    description: {
      type: String,
      default: ' ',
    },
    last_date: {
      type: Date,
    },
    groups: [groupSchema],
  },
  { timestamps: true }
);

const Subject = mongoose.model('Subject', subjectSchema);
const Group = mongoose.model('Group', groupSchema);
const Phase = mongoose.model('Phase', phaseSchema);

module.exports = { Subject, Group, Phase };
