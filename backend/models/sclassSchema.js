const mongoose = require("mongoose");

const sclassSchema = new mongoose.Schema({
    sclassName: {
        type: String,
        required: true,
        trim: true
    },
    classCode: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    academicYear: {
        type: String,
        required: true 
    },
    semester: {
        type: String,
        enum: ['semester1', 'semester2', 'summer']
    },
    department: {
        type: String 
    },
    homeroomTeacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'teacher'
    },
    students: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'student'
    }],
    subjects: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'subject'
    }],
    school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin',
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    notes: {
        type: String
    }
}, { timestamps: true });

module.exports = mongoose.model("sclass", sclassSchema);
