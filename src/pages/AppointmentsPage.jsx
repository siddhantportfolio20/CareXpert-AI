import React, { useState, useEffect } from 'react';
import { AppointmentCard } from '../components/AppointmentCard';
import { PDFViewer } from '../components/PDFViewer';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import axios from 'axios';
export const AppointmentsPage = () => {
    const { user } = useAuth();
    const { showToast } = useToast();
    const [appointments, setAppointments] = useState([]);
    const [filter, setFilter] = useState('All');
    const [showPdfViewer, setShowPdfViewer] = useState(false);
    const [selectedReportId, setSelectedReportId] = useState('');
    useEffect(() => {
        fetchAppointments();
    }, [user]);
    const fetchAppointments = async () => {
        try {
            const token = localStorage.getItem('carexpert_token');
            if (!token)
                return;
            const endpoint = user?.role === 'Doctor' ? '/api/appointments/doctor-schedule' : '/api/appointments/history';
            const res = await axios.get(endpoint, { headers: { Authorization: `Bearer ${token}` } });
            if (res.data.success)
                setAppointments(res.data.appointments || []);
        }
        catch (err) {
            console.warn('Appointments fetch error:', err);
        }
    };
    const handleStatusUpdate = async (id, status) => {
        try {
            const token = localStorage.getItem('carexpert_token');
            const res = await axios.put(`/api/appointments/${id}/status`, { status }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                showToast('Appointment Updated', `Marked as ${status}`, 'success');
                fetchAppointments();
            }
        }
        catch (err) {
            showToast('Error', err.response?.data?.message || 'Failed to update status.', 'error');
        }
    };
    const filteredAppointments = appointments.filter(a => filter === 'All' || a.status === filter);
    return (<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-black text-white">Appointments Management</h1>
        <p className="text-sm text-slate-400">View and update active, pending, and completed consultations.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {['All', 'Pending', 'Accepted', 'Completed', 'Cancelled'].map(f => (<button key={f} onClick={() => setFilter(f)} className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${filter === f
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'}`}>
            {f}
          </button>))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredAppointments.length === 0 ? (<div className="col-span-full py-16 text-center text-slate-500 italic">
            No appointments found in this category.
          </div>) : (filteredAppointments.map(apt => (<AppointmentCard key={apt.id} appointment={apt} userRole={user?.role || 'Patient'} onStatusUpdate={handleStatusUpdate} onViewPDF={(a) => {
                setSelectedReportId(a.id);
                setShowPdfViewer(true);
            }}/>)))}
      </div>

      <PDFViewer isOpen={showPdfViewer} onClose={() => setShowPdfViewer(false)} reportId={selectedReportId}/>
    </div>);
};
