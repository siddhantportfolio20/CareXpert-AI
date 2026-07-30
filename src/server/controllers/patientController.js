import { db } from '../db.js';
export const bookAppointment = async (req, res) => {
    try {
        const patient = req.user;
        if (!patient) {
            res.status(401).json({ success: false, message: 'Unauthorized' });
            return;
        }
        const { doctorId, date, timeSlot, reason, symptoms } = req.body;
        if (!doctorId || !date || !timeSlot) {
            res.status(400).json({ success: false, message: 'Doctor ID, date, and time slot are required.' });
            return;
        }
        const users = db.get('users');
        const doctor = users.find(u => u.id === doctorId && u.role === 'Doctor');
        if (!doctor) {
            res.status(404).json({ success: false, message: 'Doctor not found.' });
            return;
        }
        const appointments = db.get('appointments');
        const newApt = {
            id: 'apt-' + Date.now(),
            patientId: patient.id,
            patientName: patient.name,
            patientEmail: patient.email,
            doctorId: doctor.id,
            doctorName: doctor.name,
            doctorSpecialization: doctor.specialization,
            hospitalName: doctor.hospitalName || 'CareXpert Medical Network',
            date,
            timeSlot,
            status: 'Pending',
            reason: reason || 'General Consultation',
            symptoms: symptoms || '',
            fee: doctor.consultationFee,
            createdAt: new Date().toISOString()
        };
        appointments.unshift(newApt);
        db.save('appointments', appointments);
        // Notify doctor
        const notifications = db.get('notifications');
        const doctorNotif = {
            id: 'notif-' + Date.now(),
            userId: doctor.id,
            title: 'New Appointment Booking',
            message: `${patient.name} booked an appointment for ${date} at ${timeSlot}.`,
            type: 'appointment',
            isRead: false,
            createdAt: new Date().toISOString()
        };
        notifications.unshift(doctorNotif);
        db.save('notifications', notifications);
        db.addActivityLog(patient.name, 'Booked Appointment', `Booked appointment with ${doctor.name} on ${date}`);
        res.status(201).json({
            success: true,
            message: 'Appointment request submitted successfully.',
            appointment: newApt
        });
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
export const cancelAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        const appointments = db.get('appointments');
        const aptIdx = appointments.findIndex(a => a.id === id);
        if (aptIdx === -1) {
            res.status(404).json({ success: false, message: 'Appointment not found.' });
            return;
        }
        appointments[aptIdx].status = 'Cancelled';
        db.save('appointments', appointments);
        db.addActivityLog(req.user?.name || 'Patient', 'Cancelled Appointment', `Cancelled appointment ${id}`);
        res.json({ success: true, message: 'Appointment cancelled.', appointment: appointments[aptIdx] });
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
export const getAppointmentsHistory = async (req, res) => {
    try {
        const patientId = req.user?.id;
        const appointments = db.get('appointments');
        const history = req.user?.role === 'Admin'
            ? appointments
            : appointments.filter(a => a.patientId === patientId || a.doctorId === patientId);
        res.json({ success: true, appointments: history });
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
export const uploadMedicalRecord = async (req, res) => {
    try {
        const patientId = req.user?.id;
        if (!patientId) {
            res.status(401).json({ success: false, message: 'Unauthorized' });
            return;
        }
        const { title, type, fileName, doctorNotes } = req.body;
        const records = db.get('medicalRecords');
        const newRecord = {
            id: 'rec-' + Date.now(),
            patientId,
            title: title || 'Medical Document',
            type: type || 'Lab Test',
            fileName: fileName || 'Uploaded_Document.pdf',
            uploadedAt: new Date().toISOString(),
            doctorNotes: doctorNotes || ''
        };
        records.unshift(newRecord);
        db.save('medicalRecords', records);
        res.status(201).json({ success: true, message: 'Medical record uploaded.', record: newRecord });
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
export const getMedicalRecords = async (req, res) => {
    try {
        const patientId = req.params.patientId || req.user?.id;
        const records = db.get('medicalRecords');
        const patientRecords = records.filter(r => r.patientId === patientId);
        res.json({ success: true, records: patientRecords });
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
export const getPrescriptions = async (req, res) => {
    try {
        const patientId = req.user?.id;
        const prescriptions = db.get('prescriptions');
        const list = req.user?.role === 'Admin' || req.user?.role === 'Doctor'
            ? prescriptions
            : prescriptions.filter(p => p.patientId === patientId);
        res.json({ success: true, prescriptions: list });
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
export const getAIReports = async (req, res) => {
    try {
        const patientId = req.user?.id;
        const reports = db.get('aiReports');
        const list = req.user?.role === 'Admin' || req.user?.role === 'Doctor'
            ? reports
            : reports.filter(r => r.patientId === patientId);
        res.json({ success: true, reports: list });
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
