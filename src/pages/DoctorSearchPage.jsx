import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SearchBar } from '../components/SearchBar';
import { DoctorCard } from '../components/DoctorCard';
import { GoogleMaps } from '../components/GoogleMaps';
import { Modal } from '../components/Modal';
import { Calendar } from '../components/Calendar';
import { Button } from '../components/Button';
import { FormInput } from '../components/FormInput';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { DoctorGridSkeleton, HospitalMapSkeleton } from '../components/SkeletonLoader';
import axios from 'axios';
import { CheckCircle, LayoutGrid, MapPin } from 'lucide-react';
export const DoctorSearchPage = () => {
    const [searchParams] = useSearchParams();
    const { user } = useAuth();
    const { showToast } = useToast();
    const [doctors, setDoctors] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSpec, setSelectedSpec] = useState(searchParams.get('specialization') || 'All');
    const [viewMode, setViewMode] = useState('grid');
    const [isFetching, setIsFetching] = useState(true);
    // Booking Modal State
    const [showBookModal, setShowBookModal] = useState(false);
    const [selectedDoc, setSelectedDoc] = useState(null);
    const [bookingDate, setBookingDate] = useState('');
    const [bookingSlot, setBookingSlot] = useState('09:00 AM');
    const [consultReason, setConsultReason] = useState('');
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        fetchDoctors();
    }, []);
    const fetchDoctors = async () => {
        setIsFetching(true);
        try {
            const res = await axios.get('/api/admin/doctors');
            if (res.data.success)
                setDoctors(res.data.doctors || []);
        }
        catch (err) {
            console.warn('Doctor fetch error:', err);
        }
        finally {
            setIsFetching(false);
        }
    };
    const handleOpenBookModal = (doc) => {
        setSelectedDoc(doc);
        setShowBookModal(true);
    };
    const handleConfirmBooking = async (e) => {
        e.preventDefault();
        if (!selectedDoc)
            return;
        if (!bookingDate) {
            showToast('Date Required', 'Please choose a consultation date.', 'warning');
            return;
        }
        setLoading(true);
        try {
            const token = localStorage.getItem('carexpert_token');
            const res = await axios.post('/api/appointments/book', {
                doctorId: selectedDoc.id,
                date: bookingDate,
                timeSlot: bookingSlot,
                reason: consultReason || 'General Checkup & Health Consultation',
                symptoms: 'Mild discomfort'
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                showToast('Appointment Booked', `Booked consultation with ${selectedDoc.name}!`, 'success');
                setShowBookModal(false);
            }
        }
        catch (err) {
            showToast('Booking Failed', err.response?.data?.message || 'Could not book appointment.', 'error');
        }
        finally {
            setLoading(false);
        }
    };
    const specializationsList = ['All', 'Cardiology', 'Neurology', 'Dermatology', 'Pediatrics', 'General Medicine'];
    const DISEASE_SPECIALIZATION_MAP = {
        'heart': ['Cardiology'],
        'chest pain': ['Cardiology'],
        'bp': ['Cardiology'],
        'hypertension': ['Cardiology'],
        'cardiac': ['Cardiology'],
        'brain': ['Neurology'],
        'headache': ['Neurology'],
        'migraine': ['Neurology'],
        'stroke': ['Neurology'],
        'fever': ['General Medicine', 'Pediatrics'],
        'flu': ['General Medicine', 'Pediatrics'],
        'cough': ['General Medicine', 'Pediatrics'],
        'diabetes': ['General Medicine', 'Endocrinology'],
        'skin': ['Dermatology'],
        'acne': ['Dermatology'],
        'bone': ['Orthopedics'],
        'joint': ['Orthopedics'],
        'fracture': ['Orthopedics'],
        'child': ['Pediatrics'],
        'cancer': ['Oncology'],
    };
    const filteredDoctors = doctors.filter(doc => {
        const q = searchQuery.toLowerCase().trim();
        let matchesSearch = true;
        if (q) {
            const directMatch = doc.name.toLowerCase().includes(q) ||
                doc.specialization.toLowerCase().includes(q) ||
                doc.clinicAddress.toLowerCase().includes(q);
            let diseaseMatch = false;
            Object.entries(DISEASE_SPECIALIZATION_MAP).forEach(([disKey, specs]) => {
                if (q.includes(disKey) || disKey.includes(q)) {
                    if (specs.some(s => doc.specialization.toLowerCase().includes(s.toLowerCase()))) {
                        diseaseMatch = true;
                    }
                }
            });
            matchesSearch = directMatch || diseaseMatch;
        }
        const matchesSpec = selectedSpec === 'All' || doc.specialization.toLowerCase() === selectedSpec.toLowerCase();
        return matchesSearch && matchesSpec;
    });
    return (<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header with View Toggle */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-white">Find Specialist Physicians</h1>
          <p className="text-sm text-slate-400">Book instant clinical consultations or find nearby doctors on the map.</p>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-1 rounded-xl">
          <button onClick={() => setViewMode('grid')} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${viewMode === 'grid'
            ? 'bg-cyan-600 text-white shadow-md'
            : 'text-slate-400 hover:text-white'}`}>
            <LayoutGrid className="w-3.5 h-3.5"/>
            <span>Grid View</span>
          </button>
          <button onClick={() => setViewMode('map')} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${viewMode === 'map'
            ? 'bg-emerald-600 text-white shadow-md'
            : 'text-slate-400 hover:text-white'}`}>
            <MapPin className="w-3.5 h-3.5"/>
            <span>📍 Map & Nearby</span>
          </button>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="space-y-4">
        <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search disease (Chest Pain, Diabetes, Fever, Fracture), doctor name, or location..."/>

        <div className="flex flex-wrap gap-2">
          {specializationsList.map(spec => (<button key={spec} onClick={() => setSelectedSpec(spec)} className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${selectedSpec === spec
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'}`}>
              {spec}
            </button>))}
        </div>
      </div>

      {/* Main Content Area */}
      {isFetching ? (viewMode === 'grid' ? <DoctorGridSkeleton count={6}/> : <HospitalMapSkeleton />) : viewMode === 'grid' ? (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.length === 0 ? (<div className="col-span-full py-16 text-center text-slate-500 italic">
              No doctors matched your search criteria.
            </div>) : (filteredDoctors.map(doc => (<DoctorCard key={doc.id} doctor={doc} onBookAppointment={handleOpenBookModal}/>)))}
        </div>) : (<GoogleMaps doctors={filteredDoctors} onSelectDoctor={handleOpenBookModal}/>)}

      {/* Booking Modal */}
      <Modal isOpen={showBookModal} onClose={() => setShowBookModal(false)} title="Book Doctor Consultation" maxWidth="lg">
        {selectedDoc && (<form onSubmit={handleConfirmBooking} className="space-y-5">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center gap-3">
              <img src={selectedDoc.avatar} alt={selectedDoc.name} className="w-12 h-12 rounded-xl object-cover"/>
              <div>
                <h4 className="font-bold text-white text-sm">{selectedDoc.name}</h4>
                <p className="text-xs text-cyan-400 font-semibold">{selectedDoc.specialization}</p>
                <p className="text-[11px] text-emerald-400 font-bold mt-0.5">Fee: ₹{selectedDoc.consultationFee}</p>
              </div>
            </div>

            <Calendar selectedDate={bookingDate} selectedSlot={bookingSlot} onSelectDate={setBookingDate} onSelectSlot={setBookingSlot}/>

            <FormInput label="Consultation Reason / Chief Symptoms" value={consultReason} onChange={(e) => setConsultReason(e.target.value)} placeholder="e.g. Mild chest pain or routine annual checkup" required/>

            <div className="pt-2 flex justify-end gap-3 border-t border-slate-800">
              <Button onClick={() => setShowBookModal(false)} type="button" variant="ghost">
                Cancel
              </Button>
              <Button type="submit" isLoading={loading} variant="primary" icon={<CheckCircle className="w-4 h-4"/>}>
                Confirm Booking
              </Button>
            </div>
          </form>)}
      </Modal>
    </div>);
};
