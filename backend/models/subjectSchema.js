const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema({
    subName: {
        type: String,
        required: true,
        trim: true,
    },
    subCode: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    credits: {
        type: Number,
        required: true,
        min: 1,
    },
    subjectType: {
        type: String,
        enum: ['theory', 'practice', 'integrated'],
        default: 'theory',
        required: true
    },
    description: {
        type: String,
        default: '',
    },
    sessions: {
        type: String,
        required: true,
    },
    academicYear: {
        type: String,
        required: true,
    },
    semester: {
        type: String,
        enum: ['semester1', 'semester2', 'summer'],
        required: true,
    },
    department: {
        type: String,
        required: true, 
    },
    sclassName: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'sclass',
        required: true,
    },
    school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin',
    },
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'teacher',
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active',
    }
}, { timestamps: true });

module.exports = mongoose.model("subject", subjectSchema);
