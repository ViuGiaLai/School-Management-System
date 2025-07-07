const router = require('express').Router();
const { complainCreate, complainList } = require('../controllers/complain-controller');

router.post('/ComplainCreate', complainCreate);
router.get('/ComplainList/:id', complainList);

module.exports = router;
