import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Brain, Plus, Building2, Download, FolderOpen, Stethoscope, Upload } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ProfileCard } from '../components/ProfileCard';
import { AppointmentCard } from '../components/AppointmentCard';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Table } from '../components/Table';
import { Tabs } from '../components/Tabs';
import { AIDiagnosisModal } from '../components/AIDiagnosisModal';
import { PDFViewer } from '../components/PDFViewer';
export const PatientDashboard = () => {
    const { user } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('appointments');
    const [appointments, setAppointments] = useState([]);
    const [records, setRecords] = useState([]);
    const [prescriptions, setPrescriptions] = useState([]);
    const [aiReports, setAiReports] = useState([]);
    const [showAiModal, setShowAiModal] = useState(false);
    const [showPdfViewer, setShowPdfViewer] = useState(false);
    const [selectedReportId, setSelectedReportId] = useState('');
    const [newRecTitle, setNewRecTitle] = useState('');
    const [newRecType, setNewRecType] = useState('Lab Test');
    useEffect(() => {
        fetchDashboardData();
    }, [user]);
    const fetchDashboardData = async () => {
        try {
            const token = localStorage.getItem('carexpert_token');
            if (!token)
                return;
            const [aptRes, recRes, rxRes, aiRes] = await Promise.all([
                axios.get('/api/appointments/history', { headers: { Authorization: `Bearer ${token}` } }),
                axios.get('/api/medical-records', { headers: { Authorization: `Bearer ${token}` } }),
                axios.get('/api/prescriptions', { headers: { Authorization: `Bearer ${token}` } }),
                axios.get('/api/ai/reports', { headers: { Authorization: `Bearer ${token}` } })
            ]);
            if (aptRes.data.success)
                setAppointments(aptRes.data.appointments || []);
            if (recRes.data.success)
                setRecords(recRes.data.records || []);
            if (rxRes.data.success)
                setPrescriptions(rxRes.data.prescriptions || []);
            if (aiRes.data.success)
                setAiReports(aiRes.data.reports || []);
        }
        catch (err) {
            console.warn('Error loading patient dashboard:', err);
        }
    };
    const handleCancelAppointment = async (id) => {
        try {
            const token = localStorage.getItem('carexpert_token');
            const res = await axios.put(`/api/appointments/${id}/cancel`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                showToast('Appointment Cancelled', 'Your appointment status was updated.', 'info');
                fetchDashboardData();
            }
        }
        catch (err) {
            showToast('Error', err.response?.data?.message || 'Could not cancel appointment.', 'error');
        }
    };
    const handleUploadRecord = async (e) => {
        e.preventDefault();
        if (!newRecTitle.trim())
            return;
        try {
            const token = localStorage.getItem('carexpert_token');
            const res = await axios.post('/api/medical-records/upload', {
                title: newRecTitle,
                type: newRecType,
                fileName: `${newRecTitle.replace(/\s+/g, '_')}_2026.pdf`
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                showToast('Document Uploaded', 'Medical record added to your file vault.', 'success');
                setNewRecTitle('');
                fetchDashboardData();
            }
        }
        catch (err) {
            showToast('Upload Error', err.response?.data?.message || 'Failed to upload document.', 'error');
        }
    };
    if (!user)
        return null;
    return (<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Patient Profile Card */}
      <ProfileCard user={user}/>

      {/* Quick Action Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div onClick={() => setShowAiModal(true)} className="bg-gradient-to-r from-cyan-600 to-cyan-800 p-5 rounded-2xl text-white shadow-xl cursor-pointer hover:scale-[1.02] transition-transform flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base">Run AI Symptom Triage</h3>
            <p className="text-xs text-cyan-200 mt-0.5">Instant diagnosis & risk level</p>
          </div>
          <Brain className="w-8 h-8 text-cyan-200"/>
        </div>

        <div onClick={() => navigate('/doctors')} className="bg-gradient-to-r from-emerald-600 to-emerald-800 p-5 rounded-2xl text-white shadow-xl cursor-pointer hover:scale-[1.02] transition-transform flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base">Book Doctor Consultation</h3>
            <p className="text-xs text-emerald-200 mt-0.5">Find specialist & pick date</p>
          </div>
          <Calendar className="w-8 h-8 text-emerald-200"/>
        </div>

        <div onClick={() => navigate('/hospitals')} className="bg-gradient-to-r from-slate-800 to-slate-900 p-5 rounded-2xl border border-slate-700 text-white shadow-xl cursor-pointer hover:scale-[1.02] transition-transform flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base">Find Nearby Hospitals</h3>
            <p className="text-xs text-slate-400 mt-0.5">Interactive Google Maps</p>
          </div>
          <Building2 className="w-8 h-8 text-cyan-400"/>
        </div>
      </div>

      {/* Tabs View */}
      <Card>
        <Tabs activeTab={activeTab} onChange={setActiveTab} tabs={[
            { id: 'appointments', label: 'Appointments', icon: <Calendar className="w-4 h-4"/>, badgeCount: appointments.length },
            { id: 'records', label: 'Medical Records', icon: <FolderOpen className="w-4 h-4"/>, badgeCount: records.length },
            { id: 'prescriptions', label: 'Prescriptions', icon: <Stethoscope className="w-4 h-4"/>, badgeCount: prescriptions.length },
            { id: 'ai-reports', label: 'AI Diagnosis Reports', icon: <Brain className="w-4 h-4"/>, badgeCount: aiReports.length }
        ]}/>

        <div className="pt-6">
          {/* Tab 1: Appointments */}
          {activeTab === 'appointments' && (<div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white text-base">My Scheduled Consultations</h3>
                <Button onClick={() => navigate('/doctors')} size="sm" variant="primary" icon={<Plus className="w-4 h-4"/>}>
                  Book New
                </Button>
              </div>

              {appointments.length === 0 ? (<p className="text-center py-12 text-slate-500 italic">No appointments booked yet.</p>) : (<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {appointments.map(apt => (<AppointmentCard key={apt.id} appointment={apt} userRole="Patient" onStatusUpdate={(id) => handleCancelAppointment(id)} onViewPDF={(apt) => {
                        setSelectedReportId(apt.id);
                        setShowPdfViewer(true);
                    }}/>))}
                </div>)}
            </div>)}

          {/* Tab 2: Medical Records Upload & List */}
          {activeTab === 'records' && (<div className="space-y-6">
              <form onSubmit={handleUploadRecord} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                <h4 className="font-bold text-white text-xs uppercase tracking-wider">Upload New Medical Document / Scan</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input type="text" value={newRecTitle} onChange={(e) => setNewRecTitle(e.target.value)} placeholder="Document Title (e.g. Lipid Profile Scan)" className="sm:col-span-2 bg-slate-900 border border-slate-800 text-white text-xs rounded-xl px-3.5 py-2.5 outline-none focus:border-cyan-500" required/>
                  <select value={newRecType} onChange={(e) => setNewRecType(e.target.value)} className="bg-slate-900 border border-slate-800 text-white text-xs rounded-xl px-3 py-2.5 outline-none">
                    <option value="Lab Test">Lab Test</option>
                    <option value="X-Ray">X-Ray / MRI Scan</option>
                    <option value="Discharge Summary">Discharge Summary</option>
                    <option value="Other">Other Document</option>
                  </select>
                </div>
                <div className="text-right">
                  <Button type="submit" size="sm" variant="primary" icon={<Upload className="w-3.5 h-3.5"/>}>
                    Upload File Record
                  </Button>
                </div>
              </form>

              <Table keyExtractor={(item) => item.id} columns={[
                { key: 'title', header: 'Document Title' },
                { key: 'type', header: 'Category' },
                { key: 'uploadedAt', header: 'Upload Date', render: (r) => new Date(r.uploadedAt).toLocaleDateString() },
                { key: 'doctorNotes', header: 'Doctor Comments', render: (r) => r.doctorNotes || 'No notes' }
            ]} data={records}/>
            </div>)}

          {/* Tab 3: Prescriptions */}
          {activeTab === 'prescriptions' && (<div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white text-base">Issued Digital Prescriptions</h3>
              </div>

              {prescriptions.length === 0 ? (<p className="text-center py-12 text-slate-500 italic">No prescriptions issued yet.</p>) : (<div className="space-y-4">
                  {prescriptions.map(rx => (<div key={rx.id} className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-xs">
                        <div>
                          <p className="font-bold text-white text-sm">Diagnosis: {rx.diagnosis}</p>
                          <p className="text-slate-400">Prescribed by {rx.doctorName} on {rx.date}</p>
                        </div>
                        <Button onClick={() => {
                        setSelectedReportId(rx.id);
                        setShowPdfViewer(true);
                    }} size="sm" variant="secondary" icon={<Download className="w-3.5 h-3.5"/>}>
                          Download Rx PDF
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        {rx.medicines.map((m, idx) => (<div key={idx} className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                            <p className="font-bold text-cyan-400">{m.name} ({m.dosage})</p>
                            <p className="text-slate-300 mt-0.5">{m.frequency} - {m.duration}</p>
                          </div>))}
                      </div>
                    </div>))}
                </div>)}
            </div>)}

          {/* Tab 4: AI Diagnosis Reports */}
          {activeTab === 'ai-reports' && (<div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white text-base">AI Triage Assessment History</h3>
                <Button onClick={() => setShowAiModal(true)} size="sm" variant="primary" icon={<Brain className="w-4 h-4"/>}>
                  Run New Triage
                </Button>
              </div>

              {aiReports.length === 0 ? (<p className="text-center py-12 text-slate-500 italic">No AI reports generated yet.</p>) : (<div className="space-y-3">
                  {aiReports.map(rep => (<div key={rep.id} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm">Symptoms: {rep.symptoms.join(', ')}</span>
                          <span className="text-xs bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded-md font-semibold">
                            Risk: {rep.riskLevel}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">Recommended Specialist: {rep.recommendedSpecialist} • {new Date(rep.createdAt).toLocaleDateString()}</p>
                      </div>

                      <Button onClick={() => {
                        setSelectedReportId(rep.id);
                        setShowPdfViewer(true);
                    }} size="sm" variant="secondary" icon={<Download className="w-3.5 h-3.5"/>}>
                        Download Report PDF
                      </Button>
                    </div>))}
                </div>)}
            </div>)}
        </div>
      </Card>

      {/* Modals */}
      <AIDiagnosisModal isOpen={showAiModal} onClose={() => setShowAiModal(false)} onViewPDF={(repId) => {
            setSelectedReportId(repId);
            setShowPdfViewer(true);
        }}/>

      <PDFViewer isOpen={showPdfViewer} onClose={() => setShowPdfViewer(false)} reportId={selectedReportId}/>
    </div>);
};
