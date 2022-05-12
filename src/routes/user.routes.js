const router = require('express').Router();
const userController = require('../controllers/user.controller');

router.post('/api/v1/auth/signup', userController.signup);
router.post('/api/v1/auth/login', userController.login);

module.exports = router;