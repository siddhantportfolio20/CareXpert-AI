import jwt from 'jsonwebtoken';
import { db } from '../db.js';
const JWT_SECRET = process.env.JWT_SECRET || 'carexpert_ai_super_secret_jwt_key_2026';
export function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        res.status(401).json({ success: false, message: 'Authentication required. No token provided.' });
        return;
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const users = db.get('users');
        const user = users.find(u => u.id === decoded.id || u.email === decoded.email);
        if (!user) {
            res.status(401).json({ success: false, message: 'User account no longer exists.' });
            return;
        }
        req.user = user;
        next();
    }
    catch (err) {
        res.status(403).json({ success: false, message: 'Invalid or expired authentication token.' });
    }
}
export function authorizeRoles(...roles) {
    return (req, res, next) => {
        if (!req.user) {
            res.status(401).json({ success: false, message: 'User not authenticated.' });
            return;
        }
        if (!roles.includes(req.user.role)) {
            res.status(403).json({
                success: false,
                message: `Access denied. Requires one of roles: ${roles.join(', ')}.`
            });
            return;
        }
        next();
    };
}
export function generateToken(user) {
    return jwt.sign({ id: user.id, email: user.email, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: '7d' });
}
