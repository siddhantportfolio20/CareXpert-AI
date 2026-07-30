import React, { useState, useEffect } from 'react';
import { Upload } from 'lucide-react';
import { Table } from '../components/Table';
import { Button } from '../components/Button';
import { useToast } from '../context/ToastContext';
import axios from 'axios';
export const MedicalRecordsPage = () => {
    const { showToast } = useToast();
    const [records, setRecords] = useState([]);
    const [title, setTitle] = useState('');
    const [type, setType] = useState('Lab Test');
    useEffect(() => {
        fetchRecords();
    }, []);
    const fetchRecords = async () => {
        try {
            const token = localStorage.getItem('carexpert_token');
            if (!token)
                return;
            const res = await axios.get('/api/medical-records', { headers: { Authorization: `Bearer ${token}` } });
            if (res.data.success)
                setRecords(res.data.records || []);
        }
        catch (err) {
            console.warn('Records fetch error:', err);
        }
    };
    const handleUpload = async (e) => {
        e.preventDefault();
        if (!title.trim())
            return;
        try {
            const token = localStorage.getItem('carexpert_token');
            const res = await axios.post('/api/medical-records/upload', {
                title,
                type,
                fileName: `${title.replace(/\s+/g, '_')}_2026.pdf`
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                showToast('Document Uploaded', 'Added to health record vault.', 'success');
                setTitle('');
                fetchRecords();
            }
        }
        catch (err) {
            showToast('Upload Error', err.response?.data?.message || 'Upload failed.', 'error');
        }
    };
    return (<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-black text-white">Medical Records Vault</h1>
        <p className="text-sm text-slate-400">Securely store lab tests, radiology scans, and clinical histories.</p>
      </div>

      <form onSubmit={handleUpload} className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4">
        <h3 className="font-bold text-white text-sm">Upload New Medical Record</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Document Name (e.g. Chest X-Ray Scan)" className="sm:col-span-2 bg-slate-950 border border-slate-800 text-white text-sm rounded-xl p-3 outline-none focus:border-cyan-500" required/>
          <select value={type} onChange={(e) => setType(e.target.value)} className="bg-slate-950 border border-slate-800 text-white text-sm rounded-xl p-3 outline-none">
            <option value="Lab Test">Lab Test</option>
            <option value="X-Ray">X-Ray / MRI Scan</option>
            <option value="Discharge Summary">Discharge Summary</option>
            <option value="Vaccination">Vaccination Record</option>
          </select>
        </div>

        <div className="text-right">
          <Button type="submit" variant="primary" icon={<Upload className="w-4 h-4"/>}>
            Upload Document
          </Button>
        </div>
      </form>

      <Table keyExtractor={(item) => item.id} columns={[
            { key: 'title', header: 'Document Title' },
            { key: 'type', header: 'Type' },
            { key: 'uploadedAt', header: 'Date', render: (r) => new Date(r.uploadedAt).toLocaleDateString() },
            { key: 'doctorNotes', header: 'Clinical Notes', render: (r) => r.doctorNotes || 'No notes' }
        ]} data={records}/>
    </div>);
};
