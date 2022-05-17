const router = require('express').Router();
const propertyController = require('../controllers/property.controller');
const verifyToken = require('../middlewares/verifyToken');
const upload = require('../config/multer');

router.post('/api/v1/property/create', upload.single('image'), verifyToken, propertyController.addProperty);

module.exports = router;
