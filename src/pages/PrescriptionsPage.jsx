import React, { useState, useEffect } from 'react';
import { Download, Stethoscope } from 'lucide-react';
import { Button } from '../components/Button';
import { PDFViewer } from '../components/PDFViewer';
import axios from 'axios';
export const PrescriptionsPage = () => {
    const [prescriptions, setPrescriptions] = useState([]);
    const [showPdfViewer, setShowPdfViewer] = useState(false);
    const [selectedReportId, setSelectedReportId] = useState('');
    useEffect(() => {
        fetchPrescriptions();
    }, []);
    const fetchPrescriptions = async () => {
        try {
            const token = localStorage.getItem('carexpert_token');
            if (!token)
                return;
            const res = await axios.get('/api/prescriptions', { headers: { Authorization: `Bearer ${token}` } });
            if (res.data.success)
                setPrescriptions(res.data.prescriptions || []);
        }
        catch (err) {
            console.warn('Prescriptions fetch warning:', err);
        }
    };
    return (<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-black text-white">Digital Prescriptions</h1>
        <p className="text-sm text-slate-400">View signed doctor prescriptions and export PDF copies for pharmacies.</p>
      </div>

      <div className="space-y-4">
        {prescriptions.length === 0 ? (<div className="py-16 text-center text-slate-500 italic">No prescriptions issued yet.</div>) : (prescriptions.map(rx => (<div key={rx.id} className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <Stethoscope className="w-5 h-5 text-cyan-400"/>
                    <h3 className="font-bold text-white text-base">Diagnosis: {rx.diagnosis}</h3>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">Prescribed by {rx.doctorName} on {rx.date}</p>
                </div>

                <Button onClick={() => {
                setSelectedReportId(rx.id);
                setShowPdfViewer(true);
            }} size="sm" variant="primary" icon={<Download className="w-4 h-4"/>}>
                  Download Rx PDF
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {rx.medicines.map((m, idx) => (<div key={idx} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs">
                    <p className="font-bold text-cyan-400 text-sm">{m.name}</p>
                    <p className="text-slate-300 font-semibold mt-1">Dosage: {m.dosage}</p>
                    <p className="text-slate-400 mt-0.5">{m.frequency} • {m.duration}</p>
                  </div>))}
              </div>
            </div>)))}
      </div>

      <PDFViewer isOpen={showPdfViewer} onClose={() => setShowPdfViewer(false)} reportId={selectedReportId}/>
    </div>);
};
