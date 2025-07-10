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
        ref: 'admin', // Đảm bảo ref đúng với tên model đã đăng ký
        required: true
    },
    teachSubject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'subject' // Đúng với tên model đã đăng ký
    },
    teachSclass: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'sclass' // Đúng với tên model đã đăng ký
    },
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
        presentCount: Number,
        absentCount: Number
    }]
}, { timestamps: true });

// Đảm bảo đăng ký model admin đúng tên (chữ thường)
try {
    mongoose.model("admin");
} catch (e) {
    require("./adminSchema.js");
}

module.exports = mongoose.model("teacher", teacherSchema);
module.exports = mongoose.model("teacher", teacherSchema);
