const router = require('express').Router();
const { adminRegister, 
    adminLogIn, 
    getAdminDetail,
    forgotPassword,     
    resetPassword,
} = require('../controllers/admin-controller');

// Admin Auth
router.post('/AdminCreate', adminRegister);
router.post('/AdminLogin', adminLogIn);
router.get('/Admin/:id', getAdminDetail);

// Quên mật khẩu
router.post('/ForgotPassword', forgotPassword);

// Đặt lại mật khẩu
router.post('/ResetPassword/:token', resetPassword);

module.exports = router;
