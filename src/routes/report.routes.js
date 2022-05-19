const router = require('express').Router();
const reportController = require('../controllers/report.controller');
const verifyToken = require('../middlewares/verifyToken');

router.post('/api/v1/report/:id', verifyToken, reportController.reportFraud);

module.exports = router;