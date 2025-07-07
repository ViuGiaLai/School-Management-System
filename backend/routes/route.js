const express = require('express');
const router = express.Router();

router.use('/api/auth', require('./auth.routes'));
router.use('/api/students', require('./student.routes'));
router.use('/api/teachers', require('./teacher.routes'));
router.use('/api/classes', require('./class.routes'));
router.use('/api/subjects', require('./subject.routes'));
router.use('/api/notices', require('./notice.routes'));
router.use('/api/complains', require('./complain.routes'));

module.exports = router;
