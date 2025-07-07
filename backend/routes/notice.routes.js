const router = require('express').Router();
const {
  noticeCreate, noticeList, deleteNotices,
  deleteNotice, updateNotice
} = require('../controllers/notice-controller');

router.post('/NoticeCreate', noticeCreate);
router.get('/NoticeList/:id', noticeList);
router.delete('/Notices/:id', deleteNotices);
router.delete('/Notice/:id', deleteNotice);
router.put('/Notice/:id', updateNotice);

module.exports = router;
