const express = require('express');
const userRoute = require('./userRoute');
const recruiterRoute = require('./recruiterRoute');
const jobRoute = require('./jobRoute')

const router = express.Router();

router.use('/user', userRoute);
router.use('/recruiter', recruiterRoute)
router.use('/jobs', jobRoute)


module.exports = router;
