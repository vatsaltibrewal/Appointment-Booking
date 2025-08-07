import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import 'dotenv/config';

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.user = await User.findById(decoded.id).select('-password');
            
            if (!req.user) {
                return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Not authorized, user not found' } });
            }

            next();
        } catch (error) {
            console.error(error);
            return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Not authorized, token failed' } });
        }
    }

    if (!token) {
        return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Not authorized, no token' } });
    }
};

const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ error: { code: 'FORBIDDEN', message: 'Not authorized as an admin' } });
    }
};

export { protect, admin };