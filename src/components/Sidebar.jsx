import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Calendar, FileText, Activity, User, Users, Building2, Brain, Award, BarChart3, LogOut, Stethoscope, FolderOpen } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
export const Sidebar = ({ isOpen, onClose, onOpenAIDiagnosis }) => {
    const { user, logout } = useAuth();
    const location = useLocation();
    if (!user)
        return null;
    const role = user.role;
    const patientLinks = [
        { label: 'Patient Dashboard', path: '/patient', icon: <LayoutDashboard className="w-4 h-4"/> },
        { label: 'Book Appointment', path: '/doctors', icon: <Calendar className="w-4 h-4"/> },
        { label: 'My Appointments', path: '/appointments', icon: <FileText className="w-4 h-4"/> },
        { label: 'Medical Records', path: '/medical-records', icon: <FolderOpen className="w-4 h-4"/> },
        { label: 'Prescriptions', path: '/prescriptions', icon: <Stethoscope className="w-4 h-4"/> },
        { label: 'Nearby Hospitals', path: '/hospitals', icon: <Building2 className="w-4 h-4"/> },
        { label: 'My Profile', path: '/profile', icon: <User className="w-4 h-4"/> }
    ];
    const doctorLinks = [
        { label: 'Doctor Dashboard', path: '/doctor', icon: <LayoutDashboard className="w-4 h-4"/> },
        { label: 'Today Schedule', path: '/doctor/schedule', icon: <Calendar className="w-4 h-4"/> },
        { label: 'Manage Appointments', path: '/appointments', icon: <FileText className="w-4 h-4"/> },
        { label: 'Write Prescription', path: '/prescriptions', icon: <Stethoscope className="w-4 h-4"/> },
        { label: 'Patient History', path: '/medical-records', icon: <FolderOpen className="w-4 h-4"/> },
        { label: 'My Profile', path: '/profile', icon: <User className="w-4 h-4"/> }
    ];
    const adminLinks = [
        { label: 'Admin Analytics', path: '/admin', icon: <BarChart3 className="w-4 h-4"/> },
        { label: 'Manage Doctors', path: '/admin/doctors', icon: <Stethoscope className="w-4 h-4"/> },
        { label: 'Manage Patients', path: '/admin/patients', icon: <Users className="w-4 h-4"/> },
        { label: 'Manage Appointments', path: '/appointments', icon: <Calendar className="w-4 h-4"/> },
        { label: 'Specializations', path: '/admin/specializations', icon: <Award className="w-4 h-4"/> },
        { label: 'Manage Hospitals', path: '/hospitals', icon: <Building2 className="w-4 h-4"/> },
        { label: 'Activity Logs', path: '/admin/logs', icon: <Activity className="w-4 h-4"/> }
    ];
    const links = role === 'Admin' ? adminLinks : role === 'Doctor' ? doctorLinks : patientLinks;
    return (<>
      {/* Mobile Backdrop */}
      {isOpen && (<div onClick={onClose} className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs md:hidden"/>)}

      <aside className={`fixed top-16 left-0 z-40 h-[calc(100vh-4rem)] w-64 bg-white border-r border-slate-200 p-4 flex flex-col justify-between transition-transform duration-300 md:translate-x-0 ${isOpen ? 'translate-x-0 shadow-xl' : '-translate-x-full'}`}>
        <div className="space-y-6">
          {/* AI Symptom Analyzer Trigger */}
          {onOpenAIDiagnosis && (<button onClick={() => {
                onClose();
                onOpenAIDiagnosis();
            }} className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 px-4 rounded-xl shadow-sm shadow-blue-500/20 flex items-center justify-center gap-2.5 transition-all cursor-pointer group">
              <Brain className="w-5 h-5 group-hover:rotate-12 transition-transform"/>
              <span className="text-xs tracking-wide">AI Symptom Analyzer</span>
            </button>)}

          {/* Navigation Links */}
          <div className="space-y-1">
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {role} Navigation
            </p>
            {links.map((link) => {
            const isActive = location.pathname === link.path;
            return (<Link key={link.path} to={link.path} onClick={onClose} className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${isActive
                    ? 'bg-blue-50 text-blue-600 font-semibold border-r-4 border-blue-600'
                    : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'}`}>
                  <span className={isActive ? 'text-blue-600' : 'text-slate-400'}>{link.icon}</span>
                  <span>{link.label}</span>
                </Link>);
        })}
          </div>
        </div>

        {/* Bottom Profile Summary & Logout */}
        <div className="pt-4 border-t border-slate-200 space-y-2">
          <div className="flex items-center gap-3 p-2 bg-slate-50 border border-slate-200 rounded-xl">
            <img src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80'} alt={user.name} className="w-8 h-8 rounded-lg object-cover"/>
            <div className="min-w-0 flex-1 text-xs">
              <p className="font-bold text-slate-800 truncate">{user.name}</p>
              <p className="text-[10px] text-blue-600 font-medium capitalize">{user.role}</p>
            </div>
          </div>

          <button onClick={() => {
            onClose();
            logout();
        }} className="w-full flex items-center justify-center gap-2 p-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors">
            <LogOut className="w-4 h-4"/>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>);
};
