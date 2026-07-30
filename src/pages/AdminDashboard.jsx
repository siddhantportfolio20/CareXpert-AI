import React, { useState, useEffect } from 'react';
import { Users, Stethoscope, Building2, Plus, ShieldCheck, Activity } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { StatisticsCards } from '../components/StatisticsCards';
import { Charts } from '../components/Charts';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Table } from '../components/Table';
import { Tabs } from '../components/Tabs';
import { Modal } from '../components/Modal';
import { FormInput } from '../components/FormInput';
import { Dropdown } from '../components/Dropdown';
import { Badge } from '../components/Badge';
export const AdminDashboard = () => {
    const { user } = useAuth();
    const { showToast } = useToast();
    const [activeTab, setActiveTab] = useState('analytics');
    const [analytics, setAnalytics] = useState(null);
    const [doctors, setDoctors] = useState([]);
    const [patients, setPatients] = useState([]);
    const [hospitals, setHospitals] = useState([]);
    const [appointments, setAppointments] = useState([]);
    // Add Doctor Modal
    const [showAddDocModal, setShowAddDocModal] = useState(false);
    const [docName, setDocName] = useState('');
    const [docEmail, setDocEmail] = useState('');
    const [docSpec, setDocSpec] = useState('Cardiology');
    const [docFee, setDocFee] = useState(150);
    useEffect(() => {
        fetchAdminData();
    }, []);
    const fetchAdminData = async () => {
        try {
            const token = localStorage.getItem('carexpert_token');
            if (!token)
                return;
            const [anRes, docRes, patRes, hospRes, aptRes] = await Promise.all([
                axios.get('/api/admin/analytics', { headers: { Authorization: `Bearer ${token}` } }),
                axios.get('/api/admin/doctors', { headers: { Authorization: `Bearer ${token}` } }),
                axios.get('/api/admin/patients', { headers: { Authorization: `Bearer ${token}` } }),
                axios.get('/api/hospitals', { headers: { Authorization: `Bearer ${token}` } }),
                axios.get('/api/appointments/history', { headers: { Authorization: `Bearer ${token}` } })
            ]);
            if (anRes.data.success)
                setAnalytics(anRes.data.analytics);
            if (docRes.data.success)
                setDoctors(docRes.data.doctors);
            if (patRes.data.success)
                setPatients(patRes.data.patients);
            if (hospRes.data.success)
                setHospitals(hospRes.data.hospitals);
            if (aptRes.data.success)
                setAppointments(aptRes.data.appointments);
        }
        catch (err) {
            console.warn('Admin fetch error:', err);
        }
    };
    const handleAddDoctorSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('carexpert_token');
            const res = await axios.post('/api/admin/doctors/create', {
                name: docName,
                email: docEmail,
                specialization: docSpec,
                consultationFee: docFee,
                qualification: 'MD - Board Certified'
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                showToast('Doctor Created', 'New doctor profile added to system.', 'success');
                setShowAddDocModal(false);
                fetchAdminData();
            }
        }
        catch (err) {
            showToast('Error', err.response?.data?.message || 'Could not add doctor.', 'error');
        }
    };
    if (!user || user.role !== 'Admin') {
        return (<div className="max-w-md mx-auto my-12 p-8 text-center bg-slate-900 rounded-2xl border border-slate-800">
        <ShieldCheck className="w-12 h-12 text-rose-500 mx-auto mb-3"/>
        <h2 className="text-xl font-bold text-white">Admin Credentials Required</h2>
        <p className="text-xs text-slate-400 mt-2">Switch role to Admin using the top nav pill to inspect platform controls.</p>
      </div>);
    }
    return (<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Overview Cards */}
      {analytics && <StatisticsCards stats={analytics}/>}

      {/* Main Tabs Container */}
      <Card>
        <Tabs activeTab={activeTab} onChange={setActiveTab} tabs={[
            { id: 'analytics', label: 'Platform Analytics', icon: <Activity className="w-4 h-4"/> },
            { id: 'doctors', label: 'Manage Doctors', icon: <Stethoscope className="w-4 h-4"/>, badgeCount: doctors.length },
            { id: 'patients', label: 'Manage Patients', icon: <Users className="w-4 h-4"/>, badgeCount: patients.length },
            { id: 'hospitals', label: 'Hospitals & Beds', icon: <Building2 className="w-4 h-4"/>, badgeCount: hospitals.length }
        ]}/>

        <div className="pt-6">
          {/* Tab 1: Recharts Analytics */}
          {activeTab === 'analytics' && analytics && (<div className="space-y-6">
              <Charts analytics={analytics}/>
            </div>)}

          {/* Tab 2: Manage Doctors */}
          {activeTab === 'doctors' && (<div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white text-base">Verified Clinical Doctors</h3>
                <Button onClick={() => setShowAddDocModal(true)} size="sm" variant="primary" icon={<Plus className="w-4 h-4"/>}>
                  Add Doctor
                </Button>
              </div>

              <Table keyExtractor={(item) => item.id} columns={[
                { key: 'name', header: 'Doctor Name' },
                { key: 'specialization', header: 'Specialization' },
                { key: 'consultationFee', header: 'Fee ($)', render: (d) => `$${d.consultationFee}` },
                { key: 'rating', header: 'Rating', render: (d) => `⭐ ${d.rating}` },
                {
                    key: 'status',
                    header: 'Status',
                    render: (d) => <Badge variant={d.isAvailable ? 'success' : 'neutral'}>{d.isAvailable ? 'Active' : 'Offline'}</Badge>
                }
            ]} data={doctors}/>
            </div>)}

          {/* Tab 3: Manage Patients */}
          {activeTab === 'patients' && (<div className="space-y-4">
              <h3 className="font-bold text-white text-base">Registered Patients Directory</h3>
              <Table keyExtractor={(item) => item.id} columns={[
                { key: 'name', header: 'Patient Name' },
                { key: 'email', header: 'Email' },
                { key: 'phone', header: 'Phone' },
                { key: 'bloodGroup', header: 'Blood Group', render: (p) => p.bloodGroup || 'O+' },
                { key: 'role', header: 'Account', render: (p) => <Badge variant="info">{p.role}</Badge> }
            ]} data={patients}/>
            </div>)}

          {/* Tab 4: Manage Hospitals */}
          {activeTab === 'hospitals' && (<div className="space-y-4">
              <h3 className="font-bold text-white text-base">Partner Network Hospitals</h3>
              <Table keyExtractor={(item) => item.id} columns={[
                { key: 'name', header: 'Hospital Name' },
                { key: 'city', header: 'City' },
                { key: 'phone', header: 'Emergency Phone' },
                { key: 'availableBeds', header: 'Beds Available', render: (h) => `${h.availableBeds} / ${h.totalBeds}` },
                { key: 'emergencyAvailable', header: '24/7 ICU', render: (h) => h.emergencyAvailable ? <Badge variant="danger">ICU Ready</Badge> : 'Standard' }
            ]} data={hospitals}/>
            </div>)}
        </div>
      </Card>

      {/* Add Doctor Modal */}
      <Modal isOpen={showAddDocModal} onClose={() => setShowAddDocModal(false)} title="Register New Doctor">
        <form onSubmit={handleAddDoctorSubmit} className="space-y-4">
          <FormInput label="Doctor Name" value={docName} onChange={(e) => setDocName(e.target.value)} placeholder="Dr. Alexander Wright" required/>
          <FormInput label="Email Address" type="email" value={docEmail} onChange={(e) => setDocEmail(e.target.value)} placeholder="doc.wright@carexpert.ai" required/>
          <Dropdown label="Specialization" value={docSpec} onChange={(e) => setDocSpec(e.target.value)} options={[
            { value: 'Cardiology', label: 'Cardiology' },
            { value: 'Neurology', label: 'Neurology' },
            { value: 'Dermatology', label: 'Dermatology' },
            { value: 'Pediatrics', label: 'Pediatrics' },
            { value: 'General Medicine', label: 'General Medicine' }
        ]}/>
          <FormInput label="Consultation Fee ($)" type="number" value={docFee} onChange={(e) => setDocFee(Number(e.target.value))} required/>

          <div className="pt-2 flex justify-end gap-3 border-t border-slate-800">
            <Button onClick={() => setShowAddDocModal(false)} type="button" variant="ghost">
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Register Doctor
            </Button>
          </div>
        </form>
      </Modal>
    </div>);
};
