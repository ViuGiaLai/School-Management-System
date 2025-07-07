require('dotenv').config();
const bcrypt = require('bcrypt');
const Admin = require('../models/adminSchema.js');
const Sclass = require('../models/sclassSchema.js');
const Student = require('../models/studentSchema.js');
const Teacher = require('../models/teacherSchema.js');
const Subject = require('../models/subjectSchema.js');
const Notice = require('../models/noticeSchema.js');
const Complain = require('../models/complainSchema.js');

const crypto = require('crypto');
const nodemailer = require('nodemailer');

// const adminRegister = async (req, res) => {
//     try {
//         const salt = await bcrypt.genSalt(10);
//         const hashedPass = await bcrypt.hash(req.body.password, salt);

//         const admin = new Admin({
//             ...req.body,
//             password: hashedPass
//         });

//         const existingAdminByEmail = await Admin.findOne({ email: req.body.email });
//         const existingSchool = await Admin.findOne({ schoolName: req.body.schoolName });

//         if (existingAdminByEmail) {
//             res.send({ message: 'Email already exists' });
//         }
//         else if (existingSchool) {
//             res.send({ message: 'School name already exists' });
//         }
//         else {
//             let result = await admin.save();
//             result.password = undefined;
//             res.send(result);
//         }
//     } catch (err) {
//         res.status(500).json(err);
//     }
// };

// const adminLogIn = async (req, res) => {
//     if (req.body.email && req.body.password) {
//         let admin = await Admin.findOne({ email: req.body.email });
//         if (admin) {
//             const validated = await bcrypt.compare(req.body.password, admin.password);
//             if (validated) {
//                 admin.password = undefined;
//                 res.send(admin);
//             } else {
//                 res.send({ message: "Invalid password" });
//             }
//         } else {
//             res.send({ message: "User not found" });
//         }
//     } else {
//         res.send({ message: "Email and password are required" });
//     }
// };

const adminRegister = async (req, res) => {
    try {
        const admin = new Admin({
            ...req.body
        });

        const existingAdminByEmail = await Admin.findOne({ email: req.body.email });
        const existingSchool = await Admin.findOne({ schoolName: req.body.schoolName });

        if (existingAdminByEmail) {
            res.send({ message: 'Email already exists' });
        }
        else if (existingSchool) {
            res.send({ message: 'School name already exists' });
        }
        else {
            let result = await admin.save();
            result.password = undefined;
            res.send(result);
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const adminLogIn = async (req, res) => {
    if (req.body.email && req.body.password) {
        let admin = await Admin.findOne({ email: req.body.email });
        if (admin) {
            if (req.body.password === admin.password) {
                admin.password = undefined;
                res.send(admin);
            } else {
                res.send({ message: "Invalid password" });
            }
        } else {
            res.send({ message: "User not found" });
        }
    } else {
        res.send({ message: "Email and password are required" });
    }
};

// quên mật khẩu
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const admin = await Admin.findOne({ email });
        if (!admin) return res.status(400).json({ message: "Email không tồn tại." });

        const token = crypto.randomBytes(32).toString("hex");
        admin.resetToken = token;
        admin.tokenExpires = Date.now() + 1000 * 60 * 15; // 15 phút
        await admin.save();

        const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;  // Link frontend

        const transporter = nodemailer.createTransport({
            service: 'gmail',
           auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS
            }
        });

        await transporter.sendMail({
            to: email,
            subject: '🔐 Khôi phục mật khẩu Admin',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px; background-color: #f9f9f9;">
                <h2 style="color: #333;">Yêu cầu khôi phục mật khẩu</h2>
                <p>Xin chào,</p>
                <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản quản trị.</p>
                <p>Bấm vào nút bên dưới để đặt lại mật khẩu (liên kết sẽ hết hạn sau <strong>15 phút</strong>):</p>
                <div style="text-align: center; margin: 20px 0;">
                    <a href="${resetLink}" style="background-color: #007bff; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold;">Đặt lại mật khẩu</a>
                </div>
                <p>Nếu bạn không yêu cầu hành động này, hãy bỏ qua email này.</p>
                <p style="color: #888; font-size: 12px;">© ${new Date().getFullYear()} School Management System</p>
                </div>
            `
            });

        res.json({ message: "Đã gửi email khôi phục (nếu email tồn tại)." });
    } catch (err) {
        res.status(500).json(err);
    }
};


// đặt lại mật khẩu
const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;

        const admin = await Admin.findOne({
            resetToken: token,
            tokenExpires: { $gt: Date.now() }
        });

        if (!admin) return res.status(400).json({ message: "Token không hợp lệ hoặc đã hết hạn." });

        const salt = await bcrypt.genSalt(10);
        admin.password = await bcrypt.hash(newPassword, salt);
        admin.resetToken = undefined;
        admin.tokenExpires = undefined;
        await admin.save();

        res.json({ message: "Mật khẩu đã được đặt lại thành công!" });
    } catch (err) {
        res.status(500).json(err);
    }
};

const getAdminDetail = async (req, res) => {
    try {
        let admin = await Admin.findById(req.params.id);
        if (admin) {
            admin.password = undefined;
            res.send(admin);
        }
        else {
            res.send({ message: "No admin found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
}

// const deleteAdmin = async (req, res) => {
//     try {
//         const result = await Admin.findByIdAndDelete(req.params.id)

//         await Sclass.deleteMany({ school: req.params.id });
//         await Student.deleteMany({ school: req.params.id });
//         await Teacher.deleteMany({ school: req.params.id });
//         await Subject.deleteMany({ school: req.params.id });
//         await Notice.deleteMany({ school: req.params.id });
//         await Complain.deleteMany({ school: req.params.id });

//         res.send(result)
//     } catch (error) {
//         res.status(500).json(err);
//     }
// }

// const updateAdmin = async (req, res) => {
//     try {
//         if (req.body.password) {
//             const salt = await bcrypt.genSalt(10)
//             res.body.password = await bcrypt.hash(res.body.password, salt)
//         }
//         let result = await Admin.findByIdAndUpdate(req.params.id,
//             { $set: req.body },
//             { new: true })

//         result.password = undefined;
//         res.send(result)
//     } catch (error) {
//         res.status(500).json(err);
//     }
// }

// module.exports = { adminRegister, adminLogIn, getAdminDetail, deleteAdmin, updateAdmin };

module.exports = { adminRegister, adminLogIn, getAdminDetail,forgotPassword, resetPassword   };
