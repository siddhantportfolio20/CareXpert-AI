import React, { useState } from 'react';
import { Download, FileText, CheckCircle, AlertTriangle } from 'lucide-react';
import { Modal } from './Modal';
import { Button } from './Button';
import { useToast } from '../context/ToastContext';
export const PDFViewer = ({ isOpen, onClose, reportTitle = 'AI Medical Report & Triage Record', reportId }) => {
    const { showToast } = useToast();
    const [downloading, setDownloading] = useState(false);
    const handleDownloadPDF = async () => {
        setDownloading(true);
        try {
            const token = localStorage.getItem('carexpert_token');
            const response = await fetch(`/api/reports/download-pdf?reportId=${reportId || ''}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!response.ok)
                throw new Error('Failed to generate PDF file.');
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `CareXpertAI_Medical_Report_${Date.now().toString().slice(-6)}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            showToast('PDF Downloaded', 'Medical report PDF saved to your device.', 'success');
        }
        catch (err) {
            showToast('Download Error', err.message || 'Could not download PDF.', 'error');
        }
        finally {
            setDownloading(false);
        }
    };
    return (<Modal isOpen={isOpen} onClose={onClose} title="PDF Medical Report Preview" maxWidth="2xl">
      <div className="space-y-6">
        {/* Trial & Disclaimer Alert Box */}
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-xs text-amber-900 space-y-1 shadow-2xs">
          <div className="flex items-center gap-2 font-bold text-amber-800">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0"/>
            <span>DISCLAIMER: TRIAL PROJECT & NON-OFFICIAL REPORT</span>
          </div>
          <p className="text-[11px] leading-relaxed text-amber-900">
            This document is generated as part of a <strong>trial project</strong> for demonstration purposes. It is <strong>NOT an official medical diagnosis</strong> or clinical report. Please <strong>consult a licensed doctor</strong> or certified healthcare expert for official medical evaluation.
          </p>
        </div>

        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4 text-slate-700">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600"/>
              <h4 className="font-bold text-slate-800 text-base">{reportTitle}</h4>
            </div>
            <span className="text-xs bg-amber-50 text-amber-800 font-bold px-2.5 py-0.5 rounded-full border border-amber-200">
              Trial Preview Record
            </span>
          </div>

          <div className="text-xs space-y-2 text-slate-600">
            <p><strong className="text-slate-800">Issuer:</strong> CareXpertAI Trial Demonstration Network</p>
            <p><strong className="text-slate-800">Security Standard:</strong> 256-bit Encrypted PDF Format</p>
            <p><strong className="text-slate-800">Contents:</strong> Patient Vitals, Differential AI Diagnoses, Doctor Clinical Notes, Pharmacotherapy Prescriptions.</p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-center gap-3 shadow-2xs">
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0"/>
            <span>Ready for preview or offline printing. Remember to consult a doctor for official medical advice.</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
          <Button onClick={onClose} variant="ghost" size="md">
            Close Preview
          </Button>
          <Button onClick={handleDownloadPDF} isLoading={downloading} variant="primary" size="md" className="bg-blue-600 hover:bg-blue-700 text-white shadow-xs" icon={<Download className="w-4 h-4"/>}>
            Download PDF Report
          </Button>
        </div>
      </div>
    </Modal>);
};
