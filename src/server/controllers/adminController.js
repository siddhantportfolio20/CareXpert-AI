import { db } from '../db.js';
export const getAdminAnalytics = async (req, res) => {
    try {
        const users = db.get('users');
        const appointments = db.get('appointments');
        const specializations = db.get('specializations');
        const totalPatients = users.filter(u => u.role === 'Patient').length;
        const totalDoctors = users.filter(u => u.role === 'Doctor').length;
        const totalAppointments = appointments.length;
        const completedApts = appointments.filter(a => a.status === 'Completed' || a.status === 'Accepted');
        const totalRevenue = completedApts.reduce((acc, curr) => acc + (curr.fee || 120), 0);
        const completedCount = appointments.filter(a => a.status === 'Completed').length;
        const pendingCount = appointments.filter(a => a.status === 'Pending').length;
        const monthlyRevenue = [
            { month: 'Jan', revenue: 4200, appointments: 35 },
            { month: 'Feb', revenue: 5800, appointments: 48 },
            { month: 'Mar', revenue: 7100, appointments: 59 },
            { month: 'Apr', revenue: 6400, appointments: 52 },
            { month: 'May', revenue: 8900, appointments: 74 },
            { month: 'Jun', revenue: totalRevenue > 10000 ? totalRevenue : 11200, appointments: totalAppointments }
        ];
        const appointmentStatusBreakdown = [
            { name: 'Completed', value: completedCount || 12 },
            { name: 'Pending', value: pendingCount || 5 },
            { name: 'Accepted', value: appointments.filter(a => a.status === 'Accepted').length || 8 },
            { name: 'Cancelled', value: appointments.filter(a => a.status === 'Cancelled').length || 2 }
        ];
        const specializationDistribution = specializations.map(s => ({
            name: s.name,
            value: s.doctorsCount
        }));
        const summary = {
            totalPatients,
            totalDoctors,
            totalAppointments,
            totalRevenue,
            completedAppointments: completedCount,
            pendingAppointments: pendingCount,
            monthlyRevenue,
            appointmentStatusBreakdown,
            specializationDistribution
        };
        res.json({ success: true, analytics: summary });
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
export const getAllDoctors = async (req, res) => {
    const users = db.get('users');
    const doctors = users.filter(u => u.role === 'Doctor');
    res.json({ success: true, doctors });
};
export const getAllPatients = async (req, res) => {
    const users = db.get('users');
    const patients = users.filter(u => u.role === 'Patient');
    res.json({ success: true, patients });
};
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        let users = db.get('users');
        users = users.filter(u => u.id !== id);
        db.save('users', users);
        res.json({ success: true, message: 'User account removed.' });
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
export const getSpecializations = async (req, res) => {
    const specs = db.get('specializations');
    res.json({ success: true, specializations: specs });
};
export const createSpecialization = async (req, res) => {
    try {
        const { name, description, iconName } = req.body;
        if (!name) {
            res.status(400).json({ success: false, message: 'Specialization name is required.' });
            return;
        }
        const specs = db.get('specializations');
        const newSpec = {
            id: 'spec-' + Date.now(),
            name,
            description: description || 'Specialized medical diagnosis and treatment',
            iconName: iconName || 'Stethoscope',
            doctorsCount: 0
        };
        specs.push(newSpec);
        db.save('specializations', specs);
        res.status(201).json({ success: true, message: 'Specialization added.', specialization: newSpec });
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
export const createDoctorByAdmin = async (req, res) => {
    try {
        const { name, email, password, specialization, consultationFee, qualification, clinicAddress, city, latitude, longitude, hospitalName, bio, experienceYears } = req.body;
        if (!name || !email || !specialization) {
            res.status(400).json({ success: false, message: 'Name, email, and specialization are required.' });
            return;
        }
        const users = db.get('users');
        const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (existing) {
            res.status(400).json({ success: false, message: 'User with this email already exists.' });
            return;
        }
        const newDoc = {
            id: 'usr-doc-' + Date.now(),
            name,
            email: email.toLowerCase(),
            role: 'Doctor',
            phone: '+91 98765 43210',
            avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&auto=format&fit=crop&q=80',
            specialization: specialization || 'General Medicine',
            experienceYears: Number(experienceYears) || 5,
            consultationFee: Number(consultationFee) || 500,
            qualification: qualification || 'MD - Medical Sciences',
            clinicAddress: clinicAddress || 'City Health Center',
            city: city || 'New Delhi',
            latitude: Number(latitude) || 28.5672,
            longitude: Number(longitude) || 77.2100,
            hospitalName: hospitalName || 'CareXpert Network Hospital',
            bio: bio || 'Qualified medical practitioner providing patient-centered healthcare.',
            rating: 5.0,
            reviewsCount: 1,
            availability: {
                days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
                timeSlots: ['09:00 AM', '11:00 AM', '02:00 PM', '04:00 PM']
            },
            isVerified: true,
            createdAt: new Date().toISOString()
        };
        users.push(newDoc);
        db.save('users', users);
        res.status(201).json({ success: true, message: 'Doctor added successfully', doctor: newDoc });
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
export const getActivityLogs = async (req, res) => {
    const logs = db.get('activityLogs');
    res.json({ success: true, logs });
};
