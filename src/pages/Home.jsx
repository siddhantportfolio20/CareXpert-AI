import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HeroSection } from '../components/HeroSection';
import { DoctorCard } from '../components/DoctorCard';
import { GoogleMaps } from '../components/GoogleMaps';
import { Button } from '../components/Button';
import { AIDiagnosisModal } from '../components/AIDiagnosisModal';
import { PDFViewer } from '../components/PDFViewer';
import axios from 'axios';
import { Stethoscope, ArrowRight, Brain } from 'lucide-react';
export const Home = () => {
    const navigate = useNavigate();
    const [doctors, setDoctors] = useState([]);
    const [hospitals, setHospitals] = useState([]);
    const [specializations, setSpecializations] = useState([]);
    const [showAiModal, setShowAiModal] = useState(false);
    const [showPdfViewer, setShowPdfViewer] = useState(false);
    const [selectedReportId, setSelectedReportId] = useState('');
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [docRes, hospRes, specRes] = await Promise.all([
                    axios.get('/api/admin/doctors'),
                    axios.get('/api/hospitals'),
                    axios.get('/api/admin/specializations')
                ]);
                if (docRes.data.success)
                    setDoctors(docRes.data.doctors || []);
                if (hospRes.data.success)
                    setHospitals(hospRes.data.hospitals || []);
                if (specRes.data.success)
                    setSpecializations(specRes.data.specializations || []);
            }
            catch (err) {
                console.warn('Failed to load home page data:', err);
            }
        };
        fetchData();
    }, []);
    return (<div className="space-y-16 pb-16">
      {/* Hero Section */}
      <HeroSection onOpenAIDiagnosis={() => setShowAiModal(true)} onSearchDoctors={() => navigate('/doctors')}/>

      {/* Specializations Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
            Clinical Specialization
          </span>
          <h2 className="text-3xl font-black text-white">Find Expert Specialists By Department</h2>
          <p className="text-sm text-slate-400">Board-certified specialists across primary and acute clinical disciplines.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {specializations.slice(0, 6).map((spec) => (<div key={spec.id} onClick={() => navigate(`/doctors?specialization=${encodeURIComponent(spec.name)}`)} className="bg-slate-900/80 border border-slate-800 hover:border-cyan-500/50 rounded-2xl p-5 text-center space-y-3 cursor-pointer transition-all duration-300 hover:scale-105 group">
              <div className="w-12 h-12 mx-auto rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center group-hover:bg-cyan-500 group-hover:text-white transition-colors shadow-lg">
                <Stethoscope className="w-6 h-6"/>
              </div>
              <div>
                <h3 className="font-bold text-white text-sm group-hover:text-cyan-400 transition-colors">{spec.name}</h3>
                <p className="text-[11px] text-slate-500 mt-1">{spec.doctorsCount || 3}+ Specialists</p>
              </div>
            </div>))}
        </div>
      </section>

      {/* Featured Doctors Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-white">Featured Top-Rated Physicians</h2>
            <p className="text-sm text-slate-400">Consult with highly experienced clinical leaders.</p>
          </div>
          <Button onClick={() => navigate('/doctors')} variant="outline" size="sm" icon={<ArrowRight className="w-4 h-4"/>}>
            View All Doctors
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.slice(0, 3).map((doctor) => (<DoctorCard key={doctor.id} doctor={doctor} onBookAppointment={() => navigate('/doctors')}/>))}
        </div>
      </section>

      {/* Google Maps Hospital Finder Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <GoogleMaps hospitals={hospitals}/>
      </section>

      {/* AI Diagnosis CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative bg-gradient-to-r from-slate-900 via-cyan-950 to-slate-900 border border-cyan-500/30 rounded-3xl p-8 sm:p-12 overflow-hidden shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl text-center lg:text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold">
              <Brain className="w-4 h-4"/>
              <span>Instant Clinical Evaluation</span>
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Feeling Unwell? Let AI Diagnose Your Symptoms Instantly
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Describe your symptoms in plain language to get differential diagnostic probabilities, risk level grading, and recommended medical tests in seconds.
            </p>
          </div>

          <Button onClick={() => setShowAiModal(true)} size="lg" variant="primary" icon={<Brain className="w-5 h-5"/>} className="shrink-0 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black shadow-xl shadow-cyan-500/30">
            Launch AI Symptom Checker
          </Button>
        </div>
      </section>

      {/* Modals */}
      <AIDiagnosisModal isOpen={showAiModal} onClose={() => setShowAiModal(false)} onViewPDF={(repId) => {
            setSelectedReportId(repId);
            setShowPdfViewer(true);
        }}/>

      <PDFViewer isOpen={showPdfViewer} onClose={() => setShowPdfViewer(false)} reportId={selectedReportId}/>
    </div>);
};
