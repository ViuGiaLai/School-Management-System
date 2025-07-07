const router = require('express').Router();
const {
  subjectCreate, classSubjects, deleteSubjectsByClass, getSubjectDetail,
  deleteSubject, freeSubjectList, allSubjects, deleteSubjects
} = require('../controllers/subject-controller');

router.post('/SubjectCreate', subjectCreate);
router.get('/AllSubjects/:id', allSubjects);
router.get('/ClassSubjects/:id', classSubjects);
router.get('/FreeSubjectList/:id', freeSubjectList);
router.get('/Subject/:id', getSubjectDetail);

router.delete('/Subject/:id', deleteSubject);
router.delete('/Subjects/:id', deleteSubjects);
router.delete('/SubjectsClass/:id', deleteSubjectsByClass);

module.exports = router;
