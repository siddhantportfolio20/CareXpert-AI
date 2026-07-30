import React from 'react';
import { Activity, Heart, Shield, PhoneCall } from 'lucide-react';
import { Link } from 'react-router-dom';
export const Footer = () => {
    return (<footer className="bg-white border-t border-slate-200 pt-12 pb-8 text-slate-500 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        {/* Col 1 */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-50 border border-blue-100 text-blue-600">
              <Activity className="w-5 h-5"/>
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-800">CareXpert<span className="text-blue-600">AI</span></span>
          </div>
          <p className="text-slate-500 leading-relaxed">
            Production-grade AI-powered healthcare ecosystem providing intelligent clinical triage, doctor appointments, digital prescriptions, and emergency hospital discovery.
          </p>
          <div className="flex items-center gap-2 text-emerald-700 font-semibold">
            <Shield className="w-4 h-4 text-emerald-600"/>
            <span>256-bit Encrypted Medical Records</span>
          </div>
        </div>

        {/* Col 2 */}
        <div className="space-y-3">
          <h4 className="text-slate-800 font-bold uppercase tracking-wider text-xs">Platform Services</h4>
          <ul className="space-y-2">
            <li><Link to="/doctors" className="hover:text-blue-600 transition-colors">Find Specialist Doctors</Link></li>
            <li><Link to="/hospitals" className="hover:text-blue-600 transition-colors">Nearby Hospitals & Maps</Link></li>
            <li><Link to="/patient" className="hover:text-blue-600 transition-colors">AI Symptom Diagnostics</Link></li>
            <li><Link to="/prescriptions" className="hover:text-blue-600 transition-colors">Digital Prescriptions & PDF</Link></li>
          </ul>
        </div>

        {/* Col 3 */}
        <div className="space-y-3">
          <h4 className="text-slate-800 font-bold uppercase tracking-wider text-xs">User Portals</h4>
          <ul className="space-y-2">
            <li><Link to="/patient" className="hover:text-blue-600 transition-colors">Patient Dashboard</Link></li>
            <li><Link to="/doctor" className="hover:text-blue-600 transition-colors">Doctor Clinical Portal</Link></li>
            <li><Link to="/admin" className="hover:text-blue-600 transition-colors">Admin Revenue & Analytics</Link></li>
            <li><Link to="/auth" className="hover:text-blue-600 transition-colors">Authentication & Profile</Link></li>
          </ul>
        </div>

        {/* Col 4 */}
        <div className="space-y-3">
          <h4 className="text-slate-800 font-bold uppercase tracking-wider text-xs">24/7 Emergency Dispatch</h4>
          <div className="bg-rose-50/70 border border-rose-200 p-4 rounded-2xl space-y-2">
            <div className="flex items-center gap-2 text-rose-700 font-bold">
              <PhoneCall className="w-4 h-4 animate-bounce"/>
              <span>Emergency Hotline: 911 / +1 (800) 555-CARE</span>
            </div>
            <p className="text-[11px] text-slate-600">
              Immediate dispatch coordination with nearby hospital ICU wards.
            </p>
          </div>
        </div>
      </div>

      {/* Trial & Medical Disclaimer Bar in Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl text-amber-900 space-y-1 text-xs">
          <p className="font-bold text-amber-800">
            ⚠️ Trial Project Notice & Medical Disclaimer:
          </p>
          <p className="text-[11px] leading-relaxed text-amber-800/90">
            CareXpertAI is a <strong>trial project developed for demonstration and testing purposes</strong>. The information, AI symptom triage, simulated medical reports, and prescriptions provided by this application are <strong>NOT official medical diagnoses or clinical reports</strong>. This tool does not replace professional medical advice, diagnosis, or treatment. Always <strong>consult a licensed physician or doctor</strong> for any medical concerns or conditions.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400">
        <p>© 2026 CareXpertAI (Trial Project). All clinical rights reserved.</p>
        <div className="flex items-center gap-1 text-slate-500">
          <span>Engineered with precision for healthcare excellence</span>
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500"/>
        </div>
      </div>
    </footer>);
};
