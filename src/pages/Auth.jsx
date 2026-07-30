import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Mail, Lock, User, Phone, Stethoscope, ShieldCheck, ArrowRight, Building2, MapPin, DollarSign, Award } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { FormInput } from '../components/FormInput';
import { Dropdown } from '../components/Dropdown';
import { Button } from '../components/Button';
import axios from 'axios';
export const Auth = () => {
    const { login, registerUser } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();
    const [mode, setMode] = useState('login');
    const [role, setRole] = useState('Patient');
    // Form Fields
    const [email, setEmail] = useState('patient@carexpert.ai');
    const [password, setPassword] = useState('password');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('+91 98765 43210');
    const [specialization, setSpecialization] = useState('Cardiology');
    const [consultationFee, setConsultationFee] = useState(800);
    const [qualification, setQualification] = useState('MD, DM (Cardiology) - AIIMS New Delhi');
    const [city, setCity] = useState('New Delhi');
    const [clinicAddress, setClinicAddress] = useState('Sri Aurobindo Marg, Ansari Nagar');
    const [hospitalName, setHospitalName] = useState('AIIMS New Delhi');
    const [latitude, setLatitude] = useState(28.5672);
    const [longitude, setLongitude] = useState(77.2100);
    const [loading, setLoading] = useState(false);
    const handleRoleTabSelect = (selectedRole) => {
        setRole(selectedRole);
        if (mode === 'login') {
            if (selectedRole === 'Patient') {
                setEmail('patient@carexpert.ai');
                setPassword('password');
            }
            else if (selectedRole === 'Doctor') {
                setEmail('doctor@carexpert.ai');
                setPassword('password');
            }
            else {
                setEmail('admin@carexpert.ai');
                setPassword('password');
            }
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (mode === 'login') {
                await login(email, password);
                showToast('Welcome Back', `Signed in successfully as ${role}.`, 'success');
                if (role === 'Admin')
                    navigate('/admin');
                else if (role === 'Doctor')
                    navigate('/doctor');
                else
                    navigate('/patient');
            }
            else if (mode === 'register') {
                await registerUser({
                    name,
                    email,
                    password,
                    role,
                    phone,
                    specialization: role === 'Doctor' ? specialization : undefined,
                    consultationFee: role === 'Doctor' ? consultationFee : undefined,
                    qualification: role === 'Doctor' ? qualification : undefined
                });
                showToast('Account Created', `Registered successfully as ${role}.`, 'success');
                if (role === 'Admin')
                    navigate('/admin');
                else if (role === 'Doctor')
                    navigate('/doctor');
                else
                    navigate('/patient');
            }
            else if (mode === 'add_doctor') {
                // Direct Add Doctor Endpoint
                const token = localStorage.getItem('carexpert_token');
                const res = await axios.post('/api/admin/doctors/create', {
                    name,
                    email,
                    password,
                    specialization,
                    consultationFee,
                    qualification,
                    clinicAddress,
                    city,
                    latitude,
                    longitude,
                    hospitalName
                }, {
                    headers: token ? { Authorization: `Bearer ${token}` } : {}
                });
                if (res.data.success) {
                    showToast('Doctor Profile Added', `Dr. ${name} added to CareXpert AI platform.`, 'success');
                    setMode('login');
                    setRole('Doctor');
                    setEmail(email);
                }
            }
            else {
                await axios.post('/api/auth/forgot-password', { email });
                showToast('Password Reset Link Sent', `Sent key to ${email}`, 'info');
                setMode('login');
            }
        }
        catch (err) {
            showToast('Authentication Error', err.response?.data?.message || err.message || 'Operation failed', 'error');
        }
        finally {
            setLoading(false);
        }
    };
    return (<div className="min-h-[85vh] flex items-center justify-center px-4 py-10 bg-slate-50/50">
      <div className="w-full max-w-lg bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 mb-1">
            <Activity className="w-7 h-7"/>
          </div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">
            {mode === 'login'
            ? 'Sign In to Portal'
            : mode === 'register'
                ? 'Create New Account'
                : mode === 'add_doctor'
                    ? 'Register New Doctor'
                    : 'Reset Password'}
          </h2>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            {mode === 'login'
            ? 'Access clinical records, AI diagnoses, and appointment schedules'
            : mode === 'add_doctor'
                ? 'Add a medical doctor profile to CareXpert AI directory'
                : 'Select your role and complete details'}
          </p>
        </div>

        {/* Role Tabs for Login */}
        {mode === 'login' && (<div className="bg-slate-50 p-2 rounded-xl border border-slate-200 space-y-2">
            <p className="text-[10px] uppercase font-bold text-slate-500 text-center tracking-wider">
              Select Login Role & 1-Click Quick Fill:
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button type="button" onClick={() => handleRoleTabSelect('Patient')} className={`py-2 px-3 rounded-lg text-xs font-bold transition-all border flex items-center justify-center gap-1.5 ${role === 'Patient'
                ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'}`}>
                <User className="w-3.5 h-3.5"/>
                <span>Patient</span>
              </button>
              <button type="button" onClick={() => handleRoleTabSelect('Doctor')} className={`py-2 px-3 rounded-lg text-xs font-bold transition-all border flex items-center justify-center gap-1.5 ${role === 'Doctor'
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'}`}>
                <Stethoscope className="w-3.5 h-3.5"/>
                <span>Doctor</span>
              </button>
              <button type="button" onClick={() => handleRoleTabSelect('Admin')} className={`py-2 px-3 rounded-lg text-xs font-bold transition-all border flex items-center justify-center gap-1.5 ${role === 'Admin'
                ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'}`}>
                <ShieldCheck className="w-3.5 h-3.5"/>
                <span>Admin</span>
              </button>
            </div>
          </div>)}

        {/* Action Toggle Banner */}
        <div className="flex items-center justify-center gap-2 border-b border-slate-100 pb-3 text-xs">
          <button type="button" onClick={() => setMode('login')} className={`px-3 py-1 rounded-full font-bold transition-colors ${mode === 'login' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'text-slate-500 hover:text-slate-800'}`}>
            Sign In
          </button>
          <button type="button" onClick={() => {
            setMode('register');
            setRole('Patient');
        }} className={`px-3 py-1 rounded-full font-bold transition-colors ${mode === 'register' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'text-slate-500 hover:text-slate-800'}`}>
            Register Account
          </button>
          <button type="button" onClick={() => {
            setMode('add_doctor');
            setRole('Doctor');
        }} className={`px-3 py-1 rounded-full font-bold transition-colors ${mode === 'add_doctor' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'text-slate-500 hover:text-slate-800'}`}>
            + Add Doctor
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (<Dropdown label="Account Type" value={role} onChange={(e) => setRole(e.target.value)} options={[
                { value: 'Patient', label: 'Patient Account' },
                { value: 'Doctor', label: 'Medical Doctor' },
                { value: 'Admin', label: 'Hospital Administrator' }
            ]}/>)}

          {(mode === 'register' || mode === 'add_doctor') && (<>
              <FormInput label="Full Name" value={name} onChange={(e) => setName(e.target.value)} placeholder={mode === 'add_doctor' || role === 'Doctor' ? 'Dr. Rajesh Sharma' : 'Alex Johnson'} icon={<User className="w-4 h-4"/>} required/>

              <FormInput label="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98765 43210" icon={<Phone className="w-4 h-4"/>}/>
            </>)}

          {/* Doctor-Specific / Add Doctor Fields */}
          {(mode === 'add_doctor' || (mode === 'register' && role === 'Doctor')) && (<div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <p className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Stethoscope className="w-4 h-4 text-blue-600"/>
                <span>Doctor Professional & Location Details</span>
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Dropdown label="Specialization" value={specialization} onChange={(e) => setSpecialization(e.target.value)} options={[
                { value: 'Cardiology', label: 'Cardiology' },
                { value: 'Neurology', label: 'Neurology' },
                { value: 'Oncology', label: 'Oncology' },
                { value: 'Pediatrics', label: 'Pediatrics' },
                { value: 'Orthopedics', label: 'Orthopedics' },
                { value: 'General Medicine', label: 'General Medicine' },
                { value: 'Dermatology', label: 'Dermatology' }
            ]}/>

                <FormInput label="Consultation Fee (₹ / $)" type="number" value={consultationFee} onChange={(e) => setConsultationFee(Number(e.target.value))} icon={<DollarSign className="w-4 h-4"/>}/>
              </div>

              <FormInput label="Medical Qualification" value={qualification} onChange={(e) => setQualification(e.target.value)} placeholder="e.g. MD, DM - AIIMS New Delhi" icon={<Award className="w-4 h-4"/>}/>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Dropdown label="City" value={city} onChange={(e) => setCity(e.target.value)} options={[
                { value: 'New Delhi', label: 'New Delhi' },
                { value: 'Mumbai', label: 'Mumbai' },
                { value: 'Bengaluru', label: 'Bengaluru' },
                { value: 'Chennai', label: 'Chennai' },
                { value: 'Hyderabad', label: 'Hyderabad' },
                { value: 'Kolkata', label: 'Kolkata' },
                { value: 'Pune', label: 'Pune' }
            ]}/>

                <FormInput label="Associated Hospital" value={hospitalName} onChange={(e) => setHospitalName(e.target.value)} placeholder="e.g. AIIMS or Fortis" icon={<Building2 className="w-4 h-4"/>}/>
              </div>

              <FormInput label="Clinic Address" value={clinicAddress} onChange={(e) => setClinicAddress(e.target.value)} placeholder="e.g. Okhla Road or Bandra West" icon={<MapPin className="w-4 h-4"/>}/>

              <div className="grid grid-cols-2 gap-3">
                <FormInput label="Latitude" type="number" step="any" value={latitude} onChange={(e) => setLatitude(Number(e.target.value))}/>
                <FormInput label="Longitude" type="number" step="any" value={longitude} onChange={(e) => setLongitude(Number(e.target.value))}/>
              </div>
            </div>)}

          <FormInput label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@carexpert.ai" icon={<Mail className="w-4 h-4"/>} required/>

          {mode !== 'forgot' && (<FormInput label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" icon={<Lock className="w-4 h-4"/>} required/>)}

          {mode === 'login' && (<div className="text-right">
              <button type="button" onClick={() => setMode('forgot')} className="text-xs font-semibold text-blue-600 hover:underline">
                Forgot password?
              </button>
            </div>)}

          <Button type="submit" isLoading={loading} variant="primary" className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs" icon={<ArrowRight className="w-4 h-4"/>}>
            {mode === 'login'
            ? `Sign In as ${role}`
            : mode === 'register'
                ? `Register as ${role}`
                : mode === 'add_doctor'
                    ? 'Add Doctor to System'
                    : 'Send Reset Key'}
          </Button>
        </form>

        <div className="text-center text-xs text-slate-500 border-t border-slate-100 pt-4">
          {mode === 'login' ? (<p>
              Don't have an account?{' '}
              <button onClick={() => setMode('register')} className="text-blue-600 font-bold hover:underline">
                Register
              </button>
              {' '}or{' '}
              <button onClick={() => setMode('add_doctor')} className="text-emerald-600 font-bold hover:underline">
                Add Doctor
              </button>
            </p>) : (<p>
              Already registered?{' '}
              <button onClick={() => setMode('login')} className="text-blue-600 font-bold hover:underline">
                Sign In
              </button>
            </p>)}
        </div>
      </div>
    </div>);
};
