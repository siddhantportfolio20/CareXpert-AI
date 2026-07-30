import React, { useState, useEffect } from 'react';
import { Calendar, Clock, CheckCircle, FileText, Plus, Stethoscope, Trash2, Brain } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ProfileCard } from '../components/ProfileCard';
import { AppointmentCard } from '../components/AppointmentCard';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { FormInput } from '../components/FormInput';
import { Table } from '../components/Table';
import { Tabs } from '../components/Tabs';
import { AIDiagnosisModal } from '../components/AIDiagnosisModal';
import { PDFViewer } from '../components/PDFViewer';
export const DoctorDashboard = () => {
    const { user } = useAuth();
    const { showToast } = useToast();
    const [activeTab, setActiveTab] = useState('schedule');
    const [appointments, setAppointments] = useState([]);
    const [prescriptions, setPrescriptions] = useState([]);
    // Prescription Writer Modal State
    const [showRxModal, setShowRxModal] = useState(false);
    const [selectedApt, setSelectedApt] = useState(null);
    const [rxDiagnosis, setRxDiagnosis] = useState('');
    const [medicines, setMedicines] = useState([
        { name: 'Amoxicillin 500mg', dosage: '1 Capsule', frequency: 'Twice daily', duration: '7 days' }
    ]);
    // AI & PDF Modals
    const [showAiModal, setShowAiModal] = useState(false);
    const [showPdfViewer, setShowPdfViewer] = useState(false);
    const [selectedReportId, setSelectedReportId] = useState('');
    useEffect(() => {
        fetchDoctorData();
    }, [user]);
    const fetchDoctorData = async () => {
        try {
            const token = localStorage.getItem('carexpert_token');
            if (!token)
                return;
            const [aptRes, rxRes] = await Promise.all([
                axios.get('/api/appointments/doctor-schedule', { headers: { Authorization: `Bearer ${token}` } }),
                axios.get('/api/prescriptions', { headers: { Authorization: `Bearer ${token}` } })
            ]);
            if (aptRes.data.success)
                setAppointments(aptRes.data.appointments || []);
            if (rxRes.data.success)
                setPrescriptions(rxRes.data.prescriptions || []);
        }
        catch (err) {
            console.warn('Doctor data fetch warning:', err);
        }
    };
    const handleStatusUpdate = async (id, status) => {
        try {
            const token = localStorage.getItem('carexpert_token');
            const res = await axios.put(`/api/appointments/${id}/status`, { status }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                showToast('Status Updated', `Appointment marked as ${status}.`, 'success');
                fetchDoctorData();
            }
        }
        catch (err) {
            showToast('Error', err.response?.data?.message || 'Could not update status.', 'error');
        }
    };
    const handleOpenRxWriter = (apt) => {
        setSelectedApt(apt);
        setRxDiagnosis(apt.symptoms || apt.reason || 'General Consultation');
        setShowRxModal(true);
    };
    const handleAddMedicine = () => {
        setMedicines(prev => [...prev, { name: '', dosage: '1 Tablet', frequency: 'Twice daily', duration: '5 days' }]);
    };
    const handleRemoveMedicine = (idx) => {
        setMedicines(prev => prev.filter((_, i) => i !== idx));
    };
    const handleSavePrescription = async (e) => {
        e.preventDefault();
        if (!selectedApt)
            return;
        try {
            const token = localStorage.getItem('carexpert_token');
            const res = await axios.post('/api/prescriptions/create', {
                appointmentId: selectedApt.id,
                patientId: selectedApt.patientId,
                diagnosis: rxDiagnosis,
                medicines
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                showToast('Prescription Issued', 'Rx prescription created and saved to patient record.', 'success');
                setShowRxModal(false);
                fetchDoctorData();
            }
        }
        catch (err) {
            showToast('Error', err.response?.data?.message || 'Could not issue prescription.', 'error');
        }
    };
    if (!user)
        return null;
    return (<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Doctor Profile Banner */}
      <ProfileCard user={user}/>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase">Today's Schedule</p>
            <h3 className="text-2xl font-black text-white mt-1">{appointments.length} Consultations</h3>
          </div>
          <Calendar className="w-8 h-8 text-cyan-400"/>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase">Pending Requests</p>
            <h3 className="text-2xl font-black text-amber-400 mt-1">
              {appointments.filter(a => a.status === 'Pending').length} Pending
            </h3>
          </div>
          <Clock className="w-8 h-8 text-amber-400"/>
        </div>

        <div onClick={() => setShowAiModal(true)} className="bg-gradient-to-r from-cyan-600 to-emerald-600 p-5 rounded-2xl text-white shadow-xl cursor-pointer hover:scale-[1.02] transition-transform flex items-center justify-between">
          <div>
            <p className="text-xs text-cyan-200 font-semibold uppercase">AI Diagnostic Tool</p>
            <h3 className="text-xl font-black text-white mt-1">Run Symptom Triage</h3>
          </div>
          <Brain className="w-8 h-8 text-white"/>
        </div>
      </div>

      {/* Main Clinical Tabs */}
      <Card>
        <Tabs activeTab={activeTab} onChange={setActiveTab} tabs={[
            { id: 'schedule', label: 'Clinical Schedule & Queue', icon: <Calendar className="w-4 h-4"/>, badgeCount: appointments.length },
            { id: 'prescriptions', label: 'Issued Prescriptions', icon: <Stethoscope className="w-4 h-4"/>, badgeCount: prescriptions.length }
        ]}/>

        <div className="pt-6">
          {activeTab === 'schedule' && (<div className="space-y-4">
              <h3 className="font-bold text-white text-base">Active Consultation Queue</h3>
              {appointments.length === 0 ? (<p className="text-center py-12 text-slate-500 italic">No appointment requests in your queue.</p>) : (<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {appointments.map(apt => (<AppointmentCard key={apt.id} appointment={apt} userRole="Doctor" onStatusUpdate={handleStatusUpdate} onWritePrescription={handleOpenRxWriter} onViewPDF={(apt) => {
                        setSelectedReportId(apt.id);
                        setShowPdfViewer(true);
                    }}/>))}
                </div>)}
            </div>)}

          {activeTab === 'prescriptions' && (<div className="space-y-4">
              <h3 className="font-bold text-white text-base">Issued Prescription Records</h3>
              <Table keyExtractor={(item) => item.id} columns={[
                { key: 'patientName', header: 'Patient Name' },
                { key: 'diagnosis', header: 'Diagnosis' },
                { key: 'date', header: 'Date Issued' },
                {
                    key: 'medicines',
                    header: 'Medicines',
                    render: (p) => p.medicines.map(m => m.name).join(', ')
                },
                {
                    key: 'action',
                    header: 'Actions',
                    render: (p) => (<Button onClick={() => {
                            setSelectedReportId(p.id);
                            setShowPdfViewer(true);
                        }} size="sm" variant="secondary" icon={<FileText className="w-3.5 h-3.5"/>}>
                        PDF
                      </Button>)
                }
            ]} data={prescriptions}/>
            </div>)}
        </div>
      </Card>

      {/* Prescription Writer Modal */}
      <Modal isOpen={showRxModal} onClose={() => setShowRxModal(false)} title="Issue Rx Prescription" maxWidth="2xl">
        <form onSubmit={handleSavePrescription} className="space-y-5">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-300">
            <p><strong className="text-white">Patient:</strong> {selectedApt?.patientName}</p>
            <p><strong className="text-white">Consultation Date:</strong> {selectedApt?.date}</p>
          </div>

          <FormInput label="Clinical Diagnosis / Condition" value={rxDiagnosis} onChange={(e) => setRxDiagnosis(e.target.value)} placeholder="e.g. Acute Upper Respiratory Tract Infection" required/>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300">Prescribed Pharmacotherapy</label>
              <Button type="button" onClick={handleAddMedicine} size="sm" variant="outline" icon={<Plus className="w-3.5 h-3.5"/>}>
                Add Medicine
              </Button>
            </div>

            {medicines.map((med, idx) => (<div key={idx} className="bg-slate-950 p-3 rounded-xl border border-slate-800 grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
                <input type="text" value={med.name} onChange={(e) => {
                const val = e.target.value;
                setMedicines(prev => prev.map((m, i) => i === idx ? { ...m, name: val } : m));
            }} placeholder="Medicine Name (e.g. Amoxicillin)" className="sm:col-span-1 bg-slate-900 border border-slate-800 text-white text-xs rounded-lg p-2 outline-none" required/>
                <input type="text" value={med.dosage} onChange={(e) => {
                const val = e.target.value;
                setMedicines(prev => prev.map((m, i) => i === idx ? { ...m, dosage: val } : m));
            }} placeholder="Dosage (1 Cap)" className="bg-slate-900 border border-slate-800 text-white text-xs rounded-lg p-2 outline-none"/>
                <input type="text" value={med.frequency} onChange={(e) => {
                const val = e.target.value;
                setMedicines(prev => prev.map((m, i) => i === idx ? { ...m, frequency: val } : m));
            }} placeholder="Frequency (Twice daily)" className="bg-slate-900 border border-slate-800 text-white text-xs rounded-lg p-2 outline-none"/>
                <div className="flex items-center gap-2">
                  <input type="text" value={med.duration} onChange={(e) => {
                const val = e.target.value;
                setMedicines(prev => prev.map((m, i) => i === idx ? { ...m, duration: val } : m));
            }} placeholder="Duration (7 days)" className="w-full bg-slate-900 border border-slate-800 text-white text-xs rounded-lg p-2 outline-none"/>
                  {medicines.length > 1 && (<button type="button" onClick={() => handleRemoveMedicine(idx)} className="text-rose-400 p-1.5 hover:bg-rose-500/10 rounded-lg">
                      <Trash2 className="w-4 h-4"/>
                    </button>)}
                </div>
              </div>))}
          </div>

          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-800">
            <Button onClick={() => setShowRxModal(false)} type="button" variant="ghost">
              Cancel
            </Button>
            <Button type="submit" variant="primary" icon={<CheckCircle className="w-4 h-4"/>}>
              Save & Sign Rx
            </Button>
          </div>
        </form>
      </Modal>

      {/* AI Diagnosis & PDF Modals */}
      <AIDiagnosisModal isOpen={showAiModal} onClose={() => setShowAiModal(false)} onViewPDF={(repId) => {
            setSelectedReportId(repId);
            setShowPdfViewer(true);
        }}/>

      <PDFViewer isOpen={showPdfViewer} onClose={() => setShowPdfViewer(false)} reportId={selectedReportId}/>
    </div>);
};
