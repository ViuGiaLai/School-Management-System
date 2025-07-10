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
        ref: 'Admin', // Đảm bảo ref đúng với model admin nếu bạn dùng Admin làm school
        required: true
    },
    teachSubject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject'
    },
    teachSclass: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Sclass'
    },
    attendance: [{
        date: {
            type: Date,
            required: true
        },
        subject: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Subject'
        },
        sclass: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Sclass'
        },
        presentCount: Number,
        absentCount: Number
    }]
}, { timestamps: true });

module.exports = mongoose.model("teacher", teacherSchema);
