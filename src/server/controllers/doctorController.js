import { db } from '../db.js';
export const updateAppointmentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, notes } = req.body;
        const appointments = db.get('appointments');
        const idx = appointments.findIndex(a => a.id === id);
        if (idx === -1) {
            res.status(404).json({ success: false, message: 'Appointment not found.' });
            return;
        }
        appointments[idx].status = status;
        if (notes)
            appointments[idx].notes = notes;
        db.save('appointments', appointments);
        // Send notification to patient
        const notifications = db.get('notifications');
        notifications.unshift({
            id: 'notif-' + Date.now(),
            userId: appointments[idx].patientId,
            title: `Appointment Status Update: ${status}`,
            message: `${appointments[idx].doctorName} updated your appointment status to ${status}.`,
            type: 'appointment',
            isRead: false,
            createdAt: new Date().toISOString()
        });
        db.save('notifications', notifications);
        db.addActivityLog(req.user?.name || 'Doctor', `Updated Appointment ${status}`, `Updated appointment ${id} to ${status}`);
        res.json({ success: true, message: `Appointment ${status.toLowerCase()} successfully.`, appointment: appointments[idx] });
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
export const createPrescription = async (req, res) => {
    try {
        const doctor = req.user;
        if (!doctor) {
            res.status(401).json({ success: false, message: 'Unauthorized' });
            return;
        }
        const { appointmentId, patientId, patientName, diagnosis, medicines, advice, followUpDate } = req.body;
        if (!patientId || !medicines || medicines.length === 0) {
            res.status(400).json({ success: false, message: 'Patient ID and medicines list are required.' });
            return;
        }
        const prescriptions = db.get('prescriptions');
        const newRx = {
            id: 'rx-' + Date.now(),
            appointmentId: appointmentId || '',
            patientId,
            patientName: patientName || 'Patient',
            doctorId: doctor.id,
            doctorName: doctor.name,
            date: new Date().toISOString().split('T')[0],
            diagnosis: diagnosis || 'General Clinical Evaluation',
            medicines,
            advice: advice || 'Take rest and keep hydration levels high.',
            followUpDate: followUpDate || ''
        };
        prescriptions.unshift(newRx);
        db.save('prescriptions', prescriptions);
        // Notify patient
        const notifications = db.get('notifications');
        notifications.unshift({
            id: 'notif-' + Date.now(),
            userId: patientId,
            title: 'New Prescription Issued',
            message: `${doctor.name} issued a new prescription for your consultation.`,
            type: 'prescription',
            isRead: false,
            createdAt: new Date().toISOString()
        });
        db.save('notifications', notifications);
        db.addActivityLog(doctor.name, 'Issued Prescription', `Issued prescription for ${patientName}`);
        res.status(201).json({ success: true, message: 'Prescription written and saved.', prescription: newRx });
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
export const updateAvailability = async (req, res) => {
    try {
        const doctorId = req.user?.id;
        const { days, timeSlots } = req.body;
        const users = db.get('users');
        const idx = users.findIndex(u => u.id === doctorId && u.role === 'Doctor');
        if (idx === -1) {
            res.status(404).json({ success: false, message: 'Doctor profile not found.' });
            return;
        }
        const doc = users[idx];
        doc.availability = {
            days: days || doc.availability.days,
            timeSlots: timeSlots || doc.availability.timeSlots
        };
        users[idx] = doc;
        db.save('users', users);
        res.json({ success: true, message: 'Availability schedule updated.', availability: doc.availability });
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
export const getDoctorSchedule = async (req, res) => {
    try {
        const doctorId = req.user?.id;
        const today = new Date().toISOString().split('T')[0];
        const appointments = db.get('appointments');
        const todaysApts = appointments.filter(a => a.doctorId === doctorId && a.date === today);
        res.json({ success: true, today, schedule: todaysApts });
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
