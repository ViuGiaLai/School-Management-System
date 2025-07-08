const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
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
        default: "Admin"
    },
    schoolName: {
        type: String,
        unique: true,
        required: true
    },
    phoneNumber: {
        type: String
    },
    address: {
        type: String
    },
    avatar: {
        type: String 
    },
    isActive: {
        type: Boolean,
        default: true
    },
    permissionLevel: {
        type: String,
        enum: ['admin', 'superadmin', 'manager'],
        default: 'admin'
    },
    resetToken: {
        type: String
    },
    tokenExpires: {
        type: Date
    }
}, { timestamps: true });

module.exports = mongoose.model("admin", adminSchema);
