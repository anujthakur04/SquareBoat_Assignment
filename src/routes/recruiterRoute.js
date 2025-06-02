const userController = require('../controllers/recruiterControllers.js');
const express = require('express')
const router = express.Router();

router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.post('/job', userController.jobPost)
router.get('/jobs/:jobId/applicants', userController.listApplicants)

module.exports = router;