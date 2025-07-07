const router = require('express').Router();
const {
  sclassCreate, sclassList, deleteSclass, deleteSclasses,
  getSclassDetail, getSclassStudents
} = require('../controllers/class-controller');

router.post('/SclassCreate', sclassCreate);
router.get('/SclassList/:id', sclassList);
router.get('/Sclass/:id', getSclassDetail);
router.get('/Sclass/Students/:id', getSclassStudents);
router.delete('/Sclasses/:id', deleteSclasses);
router.delete('/Sclass/:id', deleteSclass);

module.exports = router;
