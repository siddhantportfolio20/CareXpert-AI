import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { Footer } from './components/Footer';
import { DisclaimerBanner } from './components/DisclaimerBanner';
import { AIDiagnosisModal } from './components/AIDiagnosisModal';
import { PDFViewer } from './components/PDFViewer';
// Pages
import { Home } from './pages/Home';
import { Auth } from './pages/Auth';
import { PatientDashboard } from './pages/PatientDashboard';
import { DoctorDashboard } from './pages/DoctorDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { DoctorSearchPage } from './pages/DoctorSearchPage';
import { HospitalSearchPage } from './pages/HospitalSearchPage';
import { AppointmentsPage } from './pages/AppointmentsPage';
import { PrescriptionsPage } from './pages/PrescriptionsPage';
import { MedicalRecordsPage } from './pages/MedicalRecordsPage';
import { ProfilePage } from './pages/ProfilePage';
const AppLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showAiModal, setShowAiModal] = useState(false);
    const [showPdfViewer, setShowPdfViewer] = useState(false);
    const [selectedReportId, setSelectedReportId] = useState('');
    return (<div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      <DisclaimerBanner />
      <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}/>

      <div className="flex-1 flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} onOpenAIDiagnosis={() => setShowAiModal(true)}/>

        <main className="flex-1 min-w-0 md:pl-64 transition-all">
          <Routes>
            <Route path="/" element={<Home />}/>
            <Route path="/auth" element={<Auth />}/>
            <Route path="/patient" element={<PatientDashboard />}/>
            <Route path="/doctor" element={<DoctorDashboard />}/>
            <Route path="/admin" element={<AdminDashboard />}/>
            <Route path="/doctors" element={<DoctorSearchPage />}/>
            <Route path="/hospitals" element={<HospitalSearchPage />}/>
            <Route path="/appointments" element={<AppointmentsPage />}/>
            <Route path="/prescriptions" element={<PrescriptionsPage />}/>
            <Route path="/medical-records" element={<MedicalRecordsPage />}/>
            <Route path="/profile" element={<ProfilePage />}/>
            <Route path="*" element={<Navigate to="/" replace/>}/>
          </Routes>
        </main>
      </div>

      <Footer />

      {/* Global AI Diagnosis & PDF Preview Modals */}
      <AIDiagnosisModal isOpen={showAiModal} onClose={() => setShowAiModal(false)} onViewPDF={(repId) => {
            setSelectedReportId(repId);
            setShowPdfViewer(true);
        }}/>

      <PDFViewer isOpen={showPdfViewer} onClose={() => setShowPdfViewer(false)} reportId={selectedReportId}/>
    </div>);
};
export function App() {
    return (<BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <AppLayout />
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>);
}
export default App;
