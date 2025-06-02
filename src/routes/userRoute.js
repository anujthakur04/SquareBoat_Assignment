const userController = require('../controllers/userControllers.js');
const express = require('express')
const router = express.Router();

router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.get('/all', userController.listAllUsers);

module.exports = router;