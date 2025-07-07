const router = require('express').Router();
const {
  teacherRegister, teacherLogIn, getTeachers, getTeacherDetail,
  deleteTeachers, deleteTeachersByClass, deleteTeacher,
  updateTeacherSubject, teacherAttendance
} = require('../controllers/teacher-controller');

router.post('/TeacherReg', teacherRegister);
router.post('/TeacherLogin', teacherLogIn);

router.get('/Teachers/:id', getTeachers);
router.get('/Teacher/:id', getTeacherDetail);

router.delete('/Teachers/:id', deleteTeachers);
router.delete('/TeachersClass/:id', deleteTeachersByClass);
router.delete('/Teacher/:id', deleteTeacher);

router.put('/TeacherSubject', updateTeacherSubject);
router.post('/TeacherAttendance/:id', teacherAttendance);

module.exports = router;
