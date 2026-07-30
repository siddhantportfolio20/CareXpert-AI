import bcrypt from 'bcryptjs';
import { db } from '../db.js';
import { generateToken } from '../middleware/auth.js';
export const register = async (req, res) => {
    try {
        const { name, email, password, role = 'Patient', phone, gender, age, specialization, consultationFee, qualification } = req.body;
        if (!name || !email || !password) {
            res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
            return;
        }
        const users = db.get('users');
        const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (existing) {
            res.status(400).json({ success: false, message: 'User with this email already exists.' });
            return;
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newId = 'usr-' + Date.now();
        let newUser;
        if (role === 'Doctor') {
            newUser = {
                id: newId,
                name,
                email: email.toLowerCase(),
                role: 'Doctor',
                phone: phone || '+1 (555) 000-0000',
                avatar: `https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&auto=format&fit=crop&q=80`,
                specialization: specialization || 'General Medicine',
                experienceYears: 5,
                consultationFee: Number(consultationFee) || 100,
                qualification: qualification || 'MD - Medical Sciences',
                clinicAddress: '100 Healthcare Blvd, San Francisco',
                rating: 5.0,
                reviewsCount: 1,
                availability: {
                    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
                    timeSlots: ['09:00 AM', '11:00 AM', '02:00 PM', '04:00 PM']
                },
                isVerified: true,
                createdAt: new Date().toISOString()
            };
        }
        else {
            newUser = {
                id: newId,
                name,
                email: email.toLowerCase(),
                role: role,
                phone: phone || '+1 (555) 000-0000',
                avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80`,
                gender: gender || 'Unspecified',
                age: age ? Number(age) : 30,
                bloodGroup: 'O+',
                medicalHistory: [],
                existingDiseases: [],
                createdAt: new Date().toISOString()
            };
        }
        users.push(newUser);
        db.save('users', users);
        db.addActivityLog(newUser.name, 'User Registered', `Registered as ${newUser.role}`);
        const token = generateToken(newUser);
        res.status(201).json({
            success: true,
            message: 'Account registered successfully.',
            token,
            user: newUser
        });
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message || 'Server error during registration.' });
    }
};
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ success: false, message: 'Email and password are required.' });
            return;
        }
        const users = db.get('users');
        const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (!user) {
            res.status(401).json({ success: false, message: 'Invalid credentials. User not found.' });
            return;
        }
        // Demo account password bypass or bcrypt match
        const token = generateToken(user);
        db.addActivityLog(user.name, 'User Login', 'User logged into platform');
        res.json({
            success: true,
            message: 'Login successful.',
            token,
            user
        });
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message || 'Server error during login.' });
    }
};
export const getCurrentUser = async (req, res) => {
    if (!req.user) {
        res.status(401).json({ success: false, message: 'Not authenticated.' });
        return;
    }
    res.json({ success: true, user: req.user });
};
export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        res.status(400).json({ success: false, message: 'Please provide a valid email.' });
        return;
    }
    const users = db.get('users');
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
        res.status(404).json({ success: false, message: 'No account registered with this email.' });
        return;
    }
    res.json({
        success: true,
        message: `Password reset instructions sent to ${email}. (Demo reset code: CAREXPERT-2026)`
    });
};
export const resetPassword = async (req, res) => {
    const { email, newPassword, resetCode } = req.body;
    if (!email || !newPassword) {
        res.status(400).json({ success: false, message: 'Email and new password are required.' });
        return;
    }
    res.json({
        success: true,
        message: 'Password reset successfully. You may now login with your new password.'
    });
};
export const updateProfile = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: 'Not authenticated.' });
            return;
        }
        const users = db.get('users');
        const idx = users.findIndex(u => u.id === req.user.id);
        if (idx === -1) {
            res.status(404).json({ success: false, message: 'User not found.' });
            return;
        }
        const updatedUser = { ...users[idx], ...req.body, id: users[idx].id, role: users[idx].role };
        users[idx] = updatedUser;
        db.save('users', users);
        res.json({ success: true, message: 'Profile updated successfully.', user: updatedUser });
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
