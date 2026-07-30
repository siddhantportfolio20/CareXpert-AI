import { Router } from 'express';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';
import { register, login, getCurrentUser, forgotPassword, resetPassword, updateProfile } from '../controllers/authController.js';
import { bookAppointment, cancelAppointment, getAppointmentsHistory, uploadMedicalRecord, getMedicalRecords, getPrescriptions, getAIReports } from '../controllers/patientController.js';
import { updateAppointmentStatus, createPrescription, updateAvailability, getDoctorSchedule } from '../controllers/doctorController.js';
import { getAdminAnalytics, getAllDoctors, getAllPatients, deleteUser, getSpecializations, createSpecialization, createDoctorByAdmin, getActivityLogs } from '../controllers/adminController.js';
import { generateAIDiagnosis } from '../controllers/aiController.js';
import { generateMedicalReportPDF } from '../controllers/pdfController.js';
import { getHospitals, createHospital } from '../controllers/hospitalController.js';
import { getNotifications, markNotificationRead } from '../controllers/notificationController.js';
const router = Router();
// Auth Endpoints
router.post('/auth/register', register);
router.post('/auth/login', login);
router.post('/auth/forgot-password', forgotPassword);
router.post('/auth/reset-password', resetPassword);
router.get('/auth/me', authenticateToken, getCurrentUser);
router.put('/auth/profile', authenticateToken, updateProfile);
// Patient & General Appointment Endpoints
router.post('/appointments/book', authenticateToken, bookAppointment);
router.put('/appointments/:id/cancel', authenticateToken, cancelAppointment);
router.get('/appointments/history', authenticateToken, getAppointmentsHistory);
router.post('/medical-records/upload', authenticateToken, uploadMedicalRecord);
router.get('/medical-records/:patientId?', authenticateToken, getMedicalRecords);
router.get('/prescriptions', authenticateToken, getPrescriptions);
router.get('/ai/reports', authenticateToken, getAIReports);
// Doctor Endpoints
router.put('/appointments/:id/status', authenticateToken, authorizeRoles('Doctor', 'Admin'), updateAppointmentStatus);
router.post('/prescriptions', authenticateToken, authorizeRoles('Doctor', 'Admin'), createPrescription);
router.put('/doctor/availability', authenticateToken, authorizeRoles('Doctor'), updateAvailability);
router.get('/doctor/schedule', authenticateToken, authorizeRoles('Doctor'), getDoctorSchedule);
// Admin & Doctor Management Endpoints
router.get('/admin/analytics', authenticateToken, authorizeRoles('Admin'), getAdminAnalytics);
router.get('/admin/doctors', getAllDoctors);
router.post('/admin/doctors/create', authenticateToken, authorizeRoles('Admin', 'Doctor'), createDoctorByAdmin);
router.get('/admin/patients', authenticateToken, authorizeRoles('Admin'), getAllPatients);
router.delete('/admin/users/:id', authenticateToken, authorizeRoles('Admin'), deleteUser);
router.get('/admin/specializations', getSpecializations);
router.post('/admin/specializations', authenticateToken, authorizeRoles('Admin'), createSpecialization);
router.get('/admin/activity-logs', authenticateToken, authorizeRoles('Admin'), getActivityLogs);
// Hospital Endpoints
router.get('/hospitals', getHospitals);
router.post('/hospitals', authenticateToken, authorizeRoles('Admin'), createHospital);
// Notification Endpoints
router.get('/notifications', authenticateToken, getNotifications);
router.put('/notifications/:id/read', authenticateToken, markNotificationRead);
// AI Diagnosis Service Endpoint
router.post('/ai/diagnose', authenticateToken, generateAIDiagnosis);
// PDF Generation Endpoint
router.get('/reports/download-pdf', authenticateToken, generateMedicalReportPDF);
export default router;
