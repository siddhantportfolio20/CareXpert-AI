import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { db } from '../db.js';
export const generateMedicalReportPDF = async (req, res) => {
    try {
        const { reportId, appointmentId, prescriptionId } = req.query;
        const doc = new jsPDF();
        const primaryColor = '#0284c7'; // Vibrant Blue
        const darkSlate = '#1e293b';
        // Header Banner
        doc.setFillColor(2, 132, 199);
        doc.rect(0, 0, 210, 28, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(20);
        doc.text('CAREXPERT AI HEALTHCARE', 14, 18);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text('Official Clinical Report & Health Record', 140, 18);
        // Document Metadata
        doc.setTextColor(30, 41, 59);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text(`Report Ref: REF-${Date.now().toString().slice(-6)}`, 14, 38);
        doc.text(`Generated Date: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, 130, 38);
        doc.setDrawColor(226, 232, 240);
        doc.line(14, 42, 196, 42);
        let startY = 48;
        // Fetch Patient Details
        const patientName = req.user?.name || 'Alex Johnson';
        const patientEmail = req.user?.email || 'patient@carexpert.ai';
        const patientPhone = req.user?.phone || '+1 (555) 777-8888';
        const patientAge = req.user?.age || 34;
        const patientGender = req.user?.gender || 'Male';
        doc.setFillColor(248, 250, 252);
        doc.roundedRect(14, startY, 182, 32, 2, 2, 'F');
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(2, 132, 199);
        doc.text('PATIENT INFORMATION', 18, startY + 8);
        doc.setFontSize(9.5);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(30, 41, 59);
        doc.text(`Name: ${patientName}`, 18, startY + 16);
        doc.text(`Email: ${patientEmail}`, 18, startY + 23);
        doc.text(`Phone: ${patientPhone}`, 18, startY + 28);
        doc.text(`Age: ${patientAge} Yrs`, 110, startY + 16);
        doc.text(`Gender: ${patientGender}`, 110, startY + 23);
        doc.text(`Blood Group: ${req.user?.bloodGroup || 'O+'}`, 110, startY + 28);
        startY += 38;
        // Hospital & Doctor Information
        const hospitals = db.get('hospitals');
        const hospital = hospitals[0] || {
            name: 'CareXpert Central Medical Center',
            address: '100 Healthcare Blvd, San Francisco, CA',
            phone: '+1 (555) 234-5678'
        };
        doc.setFillColor(241, 245, 249);
        doc.roundedRect(14, startY, 182, 24, 2, 2, 'F');
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(15, 23, 42);
        doc.text('FACILITY & CONSULTING PHYSICIAN', 18, startY + 7);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.text(`Hospital: ${hospital.name} (${hospital.address})`, 18, startY + 14);
        doc.text(`Contact: ${hospital.phone}`, 18, startY + 20);
        startY += 30;
        // AI Diagnosis Report Section
        const aiReports = db.get('aiReports');
        const aiReport = aiReports.find(r => r.id === reportId) || aiReports[0];
        if (aiReport) {
            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(2, 132, 199);
            doc.text('1. AI TRIAGE & DIAGNOSIS SUMMARY', 14, startY);
            startY += 6;
            const diseasesRows = aiReport.possibleDiseases.map(d => [d.name, d.probability, d.description]);
            autoTable(doc, {
                startY: startY,
                head: [['Suspected Condition', 'Probability', 'Clinical Summary']],
                body: diseasesRows.length > 0 ? diseasesRows : [['General Viral Syndrome', '60%', 'Transient systemic inflammatory response']],
                headStyles: { fillColor: [2, 132, 199], textColor: [255, 255, 255], fontStyle: 'bold' },
                styles: { fontSize: 8.5 },
                margin: { left: 14, right: 14 }
            });
            startY = doc.lastAutoTable.finalY + 8;
            doc.setFontSize(9.5);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(220, 38, 38); // Red
            doc.text(`Risk Assessment Level: ${aiReport.riskLevel.toUpperCase()}`, 14, startY);
            doc.setTextColor(30, 41, 59);
            doc.text(`Recommended Specialist: ${aiReport.recommendedSpecialist}`, 100, startY);
            startY += 6;
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(9);
            doc.text(`Recommended Tests: ${aiReport.recommendedTests.join(', ')}`, 14, startY);
            startY += 10;
        }
        // Prescription Section
        const prescriptions = db.get('prescriptions');
        const prescription = prescriptions.find(p => p.id === prescriptionId) || prescriptions[0];
        if (prescription) {
            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(2, 132, 199);
            doc.text('2. DOCTOR PRESCRIPTION & PHARMACOTHERAPY', 14, startY);
            startY += 6;
            const medRows = prescription.medicines.map(m => [m.name, m.dosage, m.frequency, m.duration]);
            autoTable(doc, {
                startY: startY,
                head: [['Medication Name', 'Dosage', 'Frequency', 'Duration']],
                body: medRows,
                headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontStyle: 'bold' },
                styles: { fontSize: 8.5 },
                margin: { left: 14, right: 14 }
            });
            startY = doc.lastAutoTable.finalY + 8;
            if (prescription.advice) {
                doc.setFontSize(9);
                doc.setFont('helvetica', 'bold');
                doc.text('Doctor Clinical Advice:', 14, startY);
                doc.setFont('helvetica', 'normal');
                doc.text(prescription.advice, 52, startY);
                startY += 8;
            }
        }
        // Disclaimer Footer
        doc.setFontSize(7);
        doc.setTextColor(180, 83, 9); // Amber-700
        doc.setFont('helvetica', 'bold');
        doc.text('DISCLAIMER (TRIAL PROJECT): This document is produced by CareXpertAI for demonstration purposes only. It is NOT an official medical report.', 14, 282);
        doc.setFont('helvetica', 'italic');
        doc.setTextColor(100, 116, 139);
        doc.text('Please consult a certified doctor or licensed healthcare professional for official diagnosis, clinical evaluation, and medical care.', 14, 287);
        const pdfBuffer = doc.output('arraybuffer');
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=CareXpertAI_Medical_Report.pdf');
        res.send(Buffer.from(pdfBuffer));
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message || 'Error generating PDF report.' });
    }
};
