const jobController = require('../controllers/jobControllers.js');
const express = require('express');
const router = express.Router();


router.get("/", jobController.listAllJobs);

router.post("/:jobId/apply", jobController.applyToJob);


router.get("/applications/candidate", jobController.getCandidateApplications);


router.get("/applications/recruiter", jobController.getApplicants);

module.exports = router;
