const router = require('express').Router();
const propertyController = require('../controllers/property.controller');
const verifyToken = require('../middlewares/verifyToken');
const upload = require('../config/multer');

router.post('/api/v1/property/create', upload.single('image'), verifyToken, propertyController.addProperty);
router.put('/api/v1/property/:id', verifyToken, propertyController.updateSold);

module.exports = router;
