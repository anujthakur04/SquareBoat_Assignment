const { User } = require('../models');
const bcrypt = require('bcrypt');

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
                role,
            })
            return res.status(200).json({ message: 'User Successfully added', userId: newUser.id })

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

    async listAllUsers(req, res) {
        try {
            const userAll = await User.findAll({ attributes: ['id', 'email', 'password', 'role'] })
            return res.json(userAll);
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' })
        }
    }
}