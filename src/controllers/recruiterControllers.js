const bcrypt = require('bcrypt')
const { User, Job } = require('../models');

module.exports = {
    async signup(req, res) {
        try {
            const { email, password, role } = req.body;
            if (!email || !password || !role) {
                return res.status(400).json({ message: 'Fields cannot be empty' })
            }
            const userExist = await User.findOne({ where: { email } });
            if (userExist) { return res.status(409).json({ message: 'User already exist!' }) }

            const passwordSecured = await bcrypt.hash(password, 10);
            const newUser = await User.create({
                email,
                password: passwordSecured,
                role: 'recruiter',
            })
            return res.status(200).json({ message: 'Recruciter Successfully added', userId: newUser.id })

        } catch (error) {
            console.log(error)
            res.status(500).json({ message: 'Something went wrong, check carefully!' })
        }
    },

    async login(req, res) {
        const { email, password } = req.body;

        try {
            if (!email || !password) {
                return res.status(400).json({ message: 'Please enter email and password.' })
            }

            const user = await User.findOne({ where: { email } });
            const passwordMatch = await bcrypt.compare(password, user.password);

            if (!user || !passwordMatch) {
                return res.status(401).json({ message: 'Invalid credentials.' })
            }

            return res.json({
                message: 'Login Successfull',
                userId: user.id,
                role: user.role,
            })

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error!" });
        }
    },
    async jobPost(req, res) {
        const { title, description, recruiterId } = req.body;
        try {
            if (!title || !description || !recruiterId) {
                return res.status(400).json({ message: 'Mandatory fields cannot be left blank.' });
            }

            const recruiter = await User.findOne({ where: { id: recruiterId, role: 'recruiter' } });
            if (!recruiter) {
                return res.status(400).json({ message: 'Invalid recruiter ID.' });
            }

            const job = await Job.create({ title, description, recruiterId })
            return res.status(200).json({ message: 'Job posted successfully created!', job })

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
        }
    },
    listApplicants: async (req, res) => {
        try {
            const { recruiterId } = req.query;
            const recruiterIdCheck = await User.findOne({ where: { id: recruiterId, role: 'recruiter' } });

            if (!recruiterId || recruiterIdCheck) {
                return res.status(400).json({ message: "Enter a valid recruiter ID." });
            }


            const jobs = await Job.findAll({
                where: { recruiterId },
                include: [
                    {
                        model: Application,
                        include: [
                            {
                                model: User,
                                as: "candidate",
                                attributes: ["id", "email", "role"],
                            },
                        ],
                    },
                ],
            });


            const response = jobs.map((job) => ({
                jobId: job.id,
                title: job.title,
                applicants: job.Applications.map((value) => ({
                    applicationId: value.id,
                    candidateId: value.candidateId,
                    candidateEmail: value.candidate.email,
                })),
            }));

            res.json(response);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error!" });
        }
    }
}