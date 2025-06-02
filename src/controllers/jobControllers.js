const { Job, User, Application } = require("../models");

module.exports = {

    async listAllJobs(req, res) {
        try {
            const jobs = await Job.findAll();

            res.json(jobs);
        } catch (error) {
            console.error("Cannot list jobs:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    },

    async applyToJob(req, res) {
        try {
            const jobId = req.params.jobId;
            const candidateId = req.body.candidateId;

            const job = await Job.findByPk(jobId);

            if (!job) {
                return res.status(404).json({ message: "Job not found!" });
            }

            const existing = await Application.findOne({
                where: { jobId, candidateId },
            });
            if (existing) {
                return res.status(409).json({ message: "You already applied to this job!" });
            }

            const application = await Application.create({ jobId, candidateId });


            res.status(201).json({ message: "Application submitted successfully!", application });
        } catch (error) {
            console.error("Error applying to job:", error);
            res.status(500).json({ message: "Internal server error!" });
        }
    },

    async getCandidateApplications(req, res) {
        try {
            const candidateId = req.query.candidateId;

            const applications = await Application.findAll({
                where: { candidateId },
                include: [{ model: Job }],
            });

            res.json(applications);
        } catch (error) {
            console.error("Error fetching applications:", error);
            res.status(500).json({ message: "Internal server error!" });
        }
    },

    async getApplicants(req, res) {
        try {
            const recruiterId = req.query.recruiterId;
            const jobs = await Job.findAll({
                where: { recruiterId },
                include: {
                    model: Application,
                    include: {
                        model: User,
                        as: "candidate",
                        attributes: ["id", "email"],
                    },
                },
            });

            res.json(jobs);
        } catch (error) {
            console.error("Error getting applicants:", error);
            res.status(500).json({ message: "Internal server error!" });
        }
    },
};
