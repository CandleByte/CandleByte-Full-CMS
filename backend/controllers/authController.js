import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import env from '../config/env.js';

export const register = async (req, res) => {

    const { username, email, password } = req.body;

    try {
        const existingUser = await User.findOne({
            $or: [{ email: email }, { username: username }]
        });

        if (existingUser) {
            return res.status(400).json({ message: "Username or email already in use." });
        }


        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });

        await newUser.save();

        res.status(201).json({ message: 'Registration successful.' });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}


export const login = async (req, res) => {

    const { loginInput, password } = req.body;

    try {

        const isEmail = loginInput.includes('@');

        const query = {};
        if (isEmail) {
            query.email = loginInput;
        } else {
            query.username = loginInput;
        }

        const user = await User.findOne(query);

        if (user) {
            const passwordCheck = await bcrypt.compare(password, user.password);
            if (passwordCheck) {
                const token = jwt.sign({ userId: user._id }, env.JWT_SECRET, { expiresIn: '7d' });
                res.status(200).json({ token });
            } else {
                res.status(401).json({ message: "Invalid email, username or password." });
            }
        } else {
            res.status(401).json({ message: "Invalid email, username or password." });
        }
    } catch (error) {
        res.status(500).json({ message: "Server error." });
    }
}