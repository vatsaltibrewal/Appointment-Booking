import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import 'dotenv/config';

const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: '1d',
    });
};

export const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: { code: 'BAD_REQUEST', message: 'Please provide all required fields' } });
    }

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ error: { code: 'USER_EXISTS', message: 'User already exists' } });
        }

        const user = await User.create({ name, email, password });

        const checkUser = await User.findById(user._id);
        if (!checkUser) {
            return res.status(400).json({ error: { code: 'INVALID_DATA', message: 'Invalid user data' } });
        }

        return res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        });

    } catch (error) {
        return res.status(500).json({ error: { code: 'SERVER_ERROR', message: error.message } });
    }
};

export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: { code: 'BAD_REQUEST', message: 'Please provide all required fields' } });
    }

    try {
        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            return res.status(200).json({
                token: generateToken(user._id, user.role),
                role: user.role,
            });
        } else {
            return res.status(401).json({ error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' } });
        }
    } catch (error) {
        return res.status(500).json({ error: { code: 'SERVER_ERROR', message: error.message } });
    }
};