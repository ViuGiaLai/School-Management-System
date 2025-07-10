const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: "Teacher"
    },
    phoneNumber: {
        type: String
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other']
    },
    dob: {
        type: Date
    },
    address: {
        type: String
    },
    avatar: {
        type: String // URL ảnh đại diện
    },
    isActive: {
        type: Boolean,
        default: true
    },
    permissionLevel: {
        type: String,
        enum: ['teacher', 'headTeacher'],
        default: 'teacher'
    },
    school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'School',
    },
    teachSubjects: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'subject',
    }],
    teachSclasses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'sclass',
    }],
    attendance: [{
        date: {
            type: Date,
            required: true
        },
        subject: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'subject'
        },
        sclass: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'sclass'
        },
        presentCount: {
            type: Number
        },
        absentCount: {
            type: Number
        }
    }]
}, { timestamps: true });

module.exports = mongoose.model("teacher", teacherSchema);
