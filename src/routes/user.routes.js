const router = require('express').Router();
const userController = require('../controllers/user.controller');
const verifyToken = require('../middlewares/verifyToken');
//const upload = require('../config/multer');

router.post('/api/v1/auth/signup', userController.signup);
router.post('/api/v1/auth/login', userController.login);
router.put('/api/v1/auth/updateuser', verifyToken, userController.resetPassword);
router.delete('/api/v1/auth/deleteuser', verifyToken, userController.deleteuser);

module.exports = router;
