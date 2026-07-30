import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { MapPin, Navigation, Phone, Building2, Star, Search, PhoneCall, Stethoscope, Compass } from 'lucide-react';
import { Button } from './Button';
import { useToast } from '../context/ToastContext';
import axios from 'axios';
const INDIAN_CITIES = [
    { name: 'All India', lat: 20.5937, lng: 78.9629, zoom: 5 },
    { name: 'New Delhi', lat: 28.5672, lng: 77.2100, zoom: 11 },
    { name: 'Mumbai', lat: 19.0200, lng: 72.8350, zoom: 11 },
    { name: 'Bengaluru', lat: 12.8850, lng: 77.6700, zoom: 11 },
    { name: 'Chennai', lat: 13.0601, lng: 80.2514, zoom: 12 },
    { name: 'Hyderabad', lat: 17.4262, lng: 78.4578, zoom: 12 },
    { name: 'Kolkata', lat: 22.5085, lng: 88.3697, zoom: 12 },
    { name: 'Pune', lat: 18.5326, lng: 73.8763, zoom: 12 },
];
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
    'nerve': ['Neurology'],
    'paralysis': ['Neurology'],
    'fever': ['General Medicine', 'Pediatrics'],
    'flu': ['General Medicine', 'Pediatrics'],
    'cough': ['General Medicine', 'Pediatrics'],
    'cold': ['General Medicine', 'Pediatrics'],
    'diabetes': ['General Medicine', 'Endocrinology'],
    'sugar': ['General Medicine', 'Endocrinology'],
    'skin': ['Dermatology'],
    'acne': ['Dermatology'],
    'rash': ['Dermatology'],
    'hair': ['Dermatology'],
    'bone': ['Orthopedics'],
    'joint': ['Orthopedics'],
    'fracture': ['Orthopedics'],
    'knee': ['Orthopedics'],
    'arthritis': ['Orthopedics'],
    'back pain': ['Orthopedics'],
    'child': ['Pediatrics'],
    'baby': ['Pediatrics'],
    'infant': ['Pediatrics'],
    'kidney': ['Nephrology', 'Urology'],
    'cancer': ['Oncology'],
    'tumor': ['Oncology'],
    'stomach': ['Gastroenterology', 'General Medicine'],
    'eye': ['Ophthalmology'],
    'ear': ['ENT'],
    'throat': ['ENT'],
};
const POPULAR_DISEASES = [
    { label: 'All Conditions', key: '' },
    { label: '❤️ Heart & Chest Pain', key: 'heart' },
    { label: '🧠 Brain & Nerves', key: 'brain' },
    { label: '🤒 Fever & Flu', key: 'fever' },
    { label: '🩸 Diabetes & Sugar', key: 'diabetes' },
    { label: '🦴 Bone & Joint Pain', key: 'bone' },
    { label: '✨ Skin & Hair Issues', key: 'skin' },
    { label: '👶 Child & Infant Care', key: 'child' },
    { label: '🎗️ Cancer & Tumor', key: 'cancer' },
];
function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
            Math.cos((lat2 * Math.PI) / 180) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Number((R * c).toFixed(1));
}
export const GoogleMaps = ({ hospitals: propHospitals, doctors: propDoctors, onSelectHospital, onSelectDoctor, }) => {
    const { showToast } = useToast();
    const [hospitals, setHospitals] = useState(propHospitals || []);
    const [doctors, setDoctors] = useState(propDoctors || []);
    const [selectedCity, setSelectedCity] = useState('All India');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDisease, setSelectedDisease] = useState('');
    const [viewType, setViewType] = useState('all');
    const [userLocation, setUserLocation] = useState(null);
    const [isLocating, setIsLocating] = useState(false);
    const [selectedHospital, setSelectedHospital] = useState(null);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const mapContainerRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const markersRef = useRef({});
    const userMarkerRef = useRef(null);
    // Fetch Hospitals if not provided
    useEffect(() => {
        if (propHospitals && propHospitals.length > 0) {
            setHospitals(propHospitals);
        }
        else {
            axios.get('/api/hospitals').then((res) => {
                if (res.data.success)
                    setHospitals(res.data.hospitals || []);
            }).catch(err => console.warn('Hospitals fetch error:', err));
        }
    }, [propHospitals]);
    // Fetch Doctors if not provided
    useEffect(() => {
        if (propDoctors && propDoctors.length > 0) {
            setDoctors(propDoctors);
        }
        else {
            axios.get('/api/admin/doctors').then((res) => {
                if (res.data.success)
                    setDoctors(res.data.doctors || []);
            }).catch(err => console.warn('Doctors fetch error:', err));
        }
    }, [propDoctors]);
    // Geolocation Handler
    const handleUseMyLocation = () => {
        if (!navigator.geolocation) {
            showToast('Geolocation Unsupported', 'Your browser does not support Geolocation.', 'warning');
            return;
        }
        setIsLocating(true);
        showToast('Locating You...', 'Accessing device location coordinates...', 'info');
        navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;
            setUserLocation({ lat: latitude, lng: longitude });
            setIsLocating(false);
            showToast('Location Detected!', `Found nearby doctors & medical centers.`, 'success');
            if (mapInstanceRef.current) {
                mapInstanceRef.current.flyTo([latitude, longitude], 13, { duration: 1.5 });
            }
        }, (error) => {
            setIsLocating(false);
            console.warn('Geolocation error:', error);
            // Default to New Delhi if permission denied or error occurs
            const fallbackLocation = { lat: 28.5672, lng: 77.2100 };
            setUserLocation(fallbackLocation);
            showToast('Location Permission', 'Using New Delhi center for nearby doctor search.', 'info');
            if (mapInstanceRef.current) {
                mapInstanceRef.current.flyTo([fallbackLocation.lat, fallbackLocation.lng], 12, { duration: 1.5 });
            }
        }, { timeout: 10000, enableHighAccuracy: true });
    };
    // Process & Distance Calculate Hospitals
    const processedHospitals = hospitals.map((h) => {
        const dist = userLocation
            ? calculateHaversineDistance(userLocation.lat, userLocation.lng, h.latitude, h.longitude)
            : null;
        return { ...h, distance: dist };
    });
    // Process & Distance Calculate Doctors
    const processedDoctors = doctors.map((d) => {
        const docLat = d.latitude || 28.5672;
        const docLng = d.longitude || 77.2100;
        const dist = userLocation
            ? calculateHaversineDistance(userLocation.lat, userLocation.lng, docLat, docLng)
            : null;
        return { ...d, latitude: docLat, longitude: docLng, distance: dist };
    });
    // Filter Hospitals
    const filteredHospitals = processedHospitals.filter((h) => {
        const matchesCity = selectedCity === 'All India' || h.city.toLowerCase() === selectedCity.toLowerCase();
        const matchesSearch = h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            h.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
            h.specialties.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesCity && matchesSearch;
    }).sort((a, b) => (a.distance !== null && b.distance !== null ? a.distance - b.distance : 0));
    // Filter Doctors
    const filteredDoctors = processedDoctors.filter((d) => {
        const docCity = d.city || 'New Delhi';
        const matchesCity = selectedCity === 'All India' || docCity.toLowerCase() === selectedCity.toLowerCase();
        // Check search query against name, spec, hospital, address, or mapped disease terms
        const q = searchQuery.toLowerCase().trim();
        let matchesSearch = true;
        if (q) {
            const directMatch = d.name.toLowerCase().includes(q) ||
                d.specialization.toLowerCase().includes(q) ||
                (d.hospitalName && d.hospitalName.toLowerCase().includes(q)) ||
                (d.clinicAddress && d.clinicAddress.toLowerCase().includes(q));
            // Check mapped disease terms
            let diseaseMatch = false;
            Object.entries(DISEASE_SPECIALIZATION_MAP).forEach(([diseaseKey, specs]) => {
                if (q.includes(diseaseKey) || diseaseKey.includes(q)) {
                    if (specs.some((s) => d.specialization.toLowerCase().includes(s.toLowerCase()))) {
                        diseaseMatch = true;
                    }
                }
            });
            matchesSearch = directMatch || diseaseMatch;
        }
        // Check selected quick disease filter pill
        let matchesDiseaseFilter = true;
        if (selectedDisease) {
            const targetSpecs = DISEASE_SPECIALIZATION_MAP[selectedDisease] || [];
            matchesDiseaseFilter = targetSpecs.some((s) => d.specialization.toLowerCase().includes(s.toLowerCase()));
        }
        return matchesCity && matchesSearch && matchesDiseaseFilter;
    }).sort((a, b) => (a.distance !== null && b.distance !== null ? a.distance - b.distance : 0));
    // Initialize Map
    useEffect(() => {
        if (!mapContainerRef.current)
            return;
        if (mapInstanceRef.current) {
            mapInstanceRef.current.remove();
            mapInstanceRef.current = null;
        }
        const map = L.map(mapContainerRef.current, {
            center: [20.5937, 78.9629],
            zoom: 5,
            zoomControl: true,
            scrollWheelZoom: true,
        });
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; OpenStreetMap contributors',
        }).addTo(map);
        mapInstanceRef.current = map;
        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, []);
    // Update Markers (Hospitals + Doctors + User Location)
    useEffect(() => {
        const map = mapInstanceRef.current;
        if (!map)
            return;
        // Clear existing item markers
        Object.values(markersRef.current).forEach((marker) => marker.remove());
        markersRef.current = {};
        // User location marker
        if (userLocation) {
            if (userMarkerRef.current)
                userMarkerRef.current.remove();
            const userIcon = L.divIcon({
                className: 'user-location-marker',
                html: `
          <div class="relative flex items-center justify-center">
            <span class="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-blue-400 opacity-75"></span>
            <div class="relative w-6 h-6 rounded-full bg-blue-600 border-2 border-white shadow-lg flex items-center justify-center text-white text-[10px] font-bold">
              You
            </div>
          </div>
        `,
                iconSize: [32, 32],
                iconAnchor: [16, 16],
            });
            userMarkerRef.current = L.marker([userLocation.lat, userLocation.lng], { icon: userIcon }).addTo(map);
            userMarkerRef.current.bindPopup(`
        <div class="p-1 font-bold text-slate-800 text-xs text-center">
          📍 Your Current Location<br/>
          <span class="text-[10px] font-normal text-slate-500">Searching nearby doctors & hospitals...</span>
        </div>
      `);
        }
        // Hospital Markers
        if (viewType === 'all' || viewType === 'hospitals') {
            filteredHospitals.forEach((h) => {
                const isSelected = selectedHospital?.id === h.id;
                const customIcon = L.divIcon({
                    className: 'custom-hospital-marker',
                    html: `
            <div class="relative group cursor-pointer">
              <div class="flex items-center gap-1.5 px-3 py-1.5 rounded-full border shadow-md text-xs font-bold transition-transform duration-200 ${isSelected
                        ? 'bg-blue-600 text-white border-blue-700 scale-110 z-30 ring-2 ring-blue-300'
                        : 'bg-white text-slate-800 border-slate-300 hover:border-blue-500 hover:scale-105'}">
                <span class="w-2 h-2 rounded-full ${h.emergencyAvailable ? 'bg-emerald-500 animate-pulse' : 'bg-blue-500'}"></span>
                <span class="truncate max-w-[100px]">${h.name.split(' ')[0]}</span>
                ${h.distance !== null ? `<span class="text-[9px] text-blue-600 bg-blue-50 px-1 rounded">${h.distance}km</span>` : ''}
              </div>
            </div>
          `,
                    iconSize: [130, 32],
                    iconAnchor: [65, 16],
                });
                const marker = L.marker([h.latitude, h.longitude], { icon: customIcon }).addTo(map);
                const popupContent = document.createElement('div');
                popupContent.className = 'p-1 text-slate-800 space-y-1 text-xs';
                popupContent.innerHTML = `
          <div class="font-bold text-slate-900 text-sm leading-tight">${h.name}</div>
          <div class="text-slate-500 text-[11px]">${h.address}, ${h.city}</div>
          ${h.distance !== null ? `<div class="font-semibold text-blue-600 text-[11px]">📍 ${h.distance} km away from you</div>` : ''}
          <div class="flex items-center gap-2 pt-1 border-t border-slate-100">
            <span class="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">${h.availableBeds} Beds Free</span>
            <span class="font-bold text-amber-700">★ ${h.rating}</span>
          </div>
        `;
                marker.bindPopup(popupContent);
                marker.on('click', () => {
                    setSelectedHospital(h);
                    setSelectedDoctor(null);
                    if (onSelectHospital)
                        onSelectHospital(h);
                });
                markersRef.current['hosp-' + h.id] = marker;
            });
        }
        // Doctor Markers
        if (viewType === 'all' || viewType === 'doctors') {
            filteredDoctors.forEach((d) => {
                const isSelected = selectedDoctor?.id === d.id;
                const doctorIcon = L.divIcon({
                    className: 'custom-doctor-marker',
                    html: `
            <div class="relative group cursor-pointer">
              <div class="flex items-center gap-1.5 px-3 py-1.5 rounded-full border shadow-md text-xs font-bold transition-transform duration-200 ${isSelected
                        ? 'bg-emerald-600 text-white border-emerald-700 scale-110 z-30 ring-2 ring-emerald-300'
                        : 'bg-white text-slate-800 border-emerald-300 hover:border-emerald-500 hover:scale-105'}">
                <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span class="truncate max-w-[100px]">${d.name.replace('Dr. ', '')}</span>
                <span class="text-[9px] bg-emerald-50 text-emerald-700 px-1 rounded">${d.specialization.slice(0, 4)}</span>
              </div>
            </div>
          `,
                    iconSize: [130, 32],
                    iconAnchor: [65, 16],
                });
                const marker = L.marker([d.latitude, d.longitude], { icon: doctorIcon }).addTo(map);
                const popupContent = document.createElement('div');
                popupContent.className = 'p-1 text-slate-800 space-y-1 text-xs';
                popupContent.innerHTML = `
          <div class="flex items-center gap-2">
            <img src="${d.avatar}" class="w-8 h-8 rounded-full object-cover" />
            <div>
              <div class="font-bold text-slate-900 text-sm leading-tight">${d.name}</div>
              <div class="text-emerald-700 font-semibold text-[11px]">${d.specialization}</div>
            </div>
          </div>
          <div class="text-slate-500 text-[11px]">${d.hospitalName || d.clinicAddress}</div>
          ${d.distance !== null ? `<div class="font-semibold text-blue-600 text-[11px]">📍 ${d.distance} km away</div>` : ''}
          <div class="flex items-center justify-between pt-1 border-t border-slate-100">
            <span class="font-bold text-emerald-700">Fee: ₹${d.consultationFee}</span>
            <span class="font-bold text-amber-700">★ ${d.rating}</span>
          </div>
        `;
                marker.bindPopup(popupContent);
                marker.on('click', () => {
                    setSelectedDoctor(d);
                    setSelectedHospital(null);
                    if (onSelectDoctor)
                        onSelectDoctor(d);
                });
                markersRef.current['doc-' + d.id] = marker;
            });
        }
    }, [filteredHospitals, filteredDoctors, selectedHospital, selectedDoctor, userLocation, viewType]);
    // Handle City Selection
    const handleCitySelect = (cityName) => {
        setSelectedCity(cityName);
        const cityObj = INDIAN_CITIES.find((c) => c.name === cityName);
        if (cityObj && mapInstanceRef.current) {
            mapInstanceRef.current.flyTo([cityObj.lat, cityObj.lng], cityObj.zoom, { duration: 1.2 });
        }
    };
    // Focus Map on Hospital
    const handleHospitalClick = (h) => {
        setSelectedHospital(h);
        setSelectedDoctor(null);
        if (onSelectHospital)
            onSelectHospital(h);
        if (mapInstanceRef.current) {
            mapInstanceRef.current.flyTo([h.latitude, h.longitude], 13, { duration: 1.2 });
            if (markersRef.current['hosp-' + h.id]) {
                markersRef.current['hosp-' + h.id].openPopup();
            }
        }
    };
    // Focus Map on Doctor
    const handleDoctorClick = (d) => {
        setSelectedDoctor(d);
        setSelectedHospital(null);
        if (onSelectDoctor)
            onSelectDoctor(d);
        if (mapInstanceRef.current && d.latitude && d.longitude) {
            mapInstanceRef.current.flyTo([d.latitude, d.longitude], 13, { duration: 1.2 });
            if (markersRef.current['doc-' + d.id]) {
                markersRef.current['doc-' + d.id].openPopup();
            }
        }
    };
    const handleGetDirections = (lat, lng) => {
        const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
        window.open(url, '_blank');
    };
    return (<div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-6">
      
      {/* Header with "Use My Location" Button */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-50 border border-blue-100 text-blue-600">
              <MapPin className="w-5 h-5 text-blue-600 animate-bounce"/>
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800 tracking-tight">
                Nearby Doctors & Hospital Emergency Locator
              </h3>
              <p className="text-xs text-slate-500">
                Use your device location to instantly find nearest verified doctors and ICU beds.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          <Button onClick={handleUseMyLocation} isLoading={isLocating} variant="primary" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 px-4 shadow-xs flex items-center gap-2" icon={<Compass className="w-4 h-4"/>}>
            {userLocation ? '📍 Location Active (Refetch)' : '📍 Use My Location & Find Nearby'}
          </Button>

          {userLocation && (<span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"/>
              Live Geolocation Active
            </span>)}
        </div>
      </div>

      {/* Category Toggle Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-50 p-2 rounded-xl border border-slate-200">
        <div className="flex items-center gap-1">
          <button onClick={() => setViewType('all')} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${viewType === 'all' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}>
            All Medical ({filteredDoctors.length + filteredHospitals.length})
          </button>
          <button onClick={() => setViewType('doctors')} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${viewType === 'doctors' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}>
            <Stethoscope className="w-3.5 h-3.5"/>
            <span>Nearby Doctors ({filteredDoctors.length})</span>
          </button>
          <button onClick={() => setViewType('hospitals')} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${viewType === 'hospitals' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}>
            <Building2 className="w-3.5 h-3.5"/>
            <span>Hospitals & ICUs ({filteredHospitals.length})</span>
          </button>
        </div>

        {/* City Filter pills */}
        <div className="flex items-center gap-1 overflow-x-auto max-w-full pb-1 sm:pb-0 scrollbar-none">
          {INDIAN_CITIES.map((city) => (<button key={city.name} onClick={() => handleCitySelect(city.name)} className={`px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all border ${selectedCity === city.name
                ? 'bg-slate-800 text-white border-slate-800'
                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'}`}>
              {city.name}
            </button>))}
        </div>
      </div>

      {/* Disease / Condition Quick Selector Bar */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
          <Stethoscope className="w-3.5 h-3.5 text-blue-600"/>
          <span>Filter Doctors Near You By Disease / Condition:</span>
        </label>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {POPULAR_DISEASES.map((dis) => (<button key={dis.key} onClick={() => setSelectedDisease(selectedDisease === dis.key ? '' : dis.key)} className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${selectedDisease === dis.key
                ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'}`}>
              {dis.label}
            </button>))}
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"/>
        <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search disease (e.g. Heart Attack, Diabetes, Fever, Fracture), doctor name or hospital..." className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-blue-500 focus:bg-white transition-all"/>
      </div>

      {/* Main Map + Results Directory */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Leaflet Map */}
        <div className="lg:col-span-7 bg-slate-50 border border-slate-200 rounded-xl h-[380px] lg:h-[500px] relative overflow-hidden flex flex-col justify-between shadow-inner">
          <div ref={mapContainerRef} className="w-full h-full z-10"/>

          {/* Map Overlay Selected Item Details */}
          {(selectedHospital || selectedDoctor) && (<div className="absolute bottom-3 left-3 right-3 z-20 bg-white/95 border border-slate-200 rounded-xl p-3 backdrop-blur-md flex items-center justify-between gap-3 text-xs shadow-md">
              <div className="min-w-0">
                {selectedHospital ? (<>
                    <div className="flex items-center gap-1.5">
                      <p className="font-bold text-slate-900 truncate">{selectedHospital.name}</p>
                      <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded border border-blue-200">
                        {selectedHospital.city}
                      </span>
                    </div>
                    <p className="text-slate-500 truncate text-[11px]">{selectedHospital.address}</p>
                  </>) : (<>
                    <div className="flex items-center gap-1.5">
                      <p className="font-bold text-slate-900 truncate">{selectedDoctor?.name}</p>
                      <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded border border-emerald-200">
                        {selectedDoctor?.specialization}
                      </span>
                    </div>
                    <p className="text-slate-500 truncate text-[11px]">Fee: ₹{selectedDoctor?.consultationFee} • {selectedDoctor?.hospitalName}</p>
                  </>)}
              </div>
              <Button onClick={() => handleGetDirections(selectedHospital ? selectedHospital.latitude : selectedDoctor?.latitude || 28.5672, selectedHospital ? selectedHospital.longitude : selectedDoctor?.longitude || 77.2100)} size="sm" variant="primary" className="bg-blue-600 hover:bg-blue-700 text-white shadow-xs shrink-0 text-xs" icon={<Navigation className="w-3.5 h-3.5"/>}>
                Directions
              </Button>
            </div>)}
        </div>

        {/* Directory List Column */}
        <div className="lg:col-span-5 space-y-3 max-h-[500px] overflow-y-auto pr-1">
          {/* Nearby Doctors Section */}
          {(viewType === 'all' || viewType === 'doctors') && (<div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 uppercase tracking-wider">
                <span className="flex items-center gap-1 text-emerald-700">
                  <Stethoscope className="w-4 h-4"/>
                  Nearby Doctors ({filteredDoctors.length})
                </span>
                {userLocation && <span className="text-[10px] text-blue-600 font-semibold">Sorted by Proximity</span>}
              </div>

              {filteredDoctors.length === 0 ? (<p className="text-xs text-slate-400 italic p-3 bg-slate-50 rounded-xl border border-slate-200">
                  No doctors matched in {selectedCity}.
                </p>) : (filteredDoctors.map((d) => {
                const isSelected = selectedDoctor?.id === d.id;
                return (<div key={d.id} onClick={() => handleDoctorClick(d)} className={`p-3.5 rounded-xl border transition-all cursor-pointer ${isSelected
                        ? 'bg-emerald-50/70 border-emerald-300 shadow-xs ring-1 ring-emerald-300'
                        : 'bg-white border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/20'}`}>
                      <div className="flex items-center gap-3">
                        <img src={d.avatar} alt={d.name} className="w-11 h-11 rounded-xl object-cover border border-slate-200 shrink-0"/>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-1">
                            <h4 className="font-bold text-slate-800 text-xs truncate">{d.name}</h4>
                            <span className="text-amber-700 text-xs font-bold shrink-0">★ {d.rating}</span>
                          </div>
                          <p className="text-[11px] font-semibold text-emerald-700">{d.specialization}</p>
                          <p className="text-[10px] text-slate-500 truncate">{d.qualification}</p>
                        </div>
                      </div>

                      <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                        <span className="font-bold text-slate-800 text-[11px]">Fee: ₹{d.consultationFee}</span>
                        {d.distance !== null ? (<span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                            📍 {d.distance} km away
                          </span>) : (<span className="text-[10px] text-slate-500">{d.city || 'New Delhi'}</span>)}
                        <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                          Available Today
                        </span>
                      </div>
                    </div>);
            }))}
            </div>)}

          {/* Nearby Hospitals Section */}
          {(viewType === 'all' || viewType === 'hospitals') && (<div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 uppercase tracking-wider">
                <span className="flex items-center gap-1 text-blue-700">
                  <Building2 className="w-4 h-4"/>
                  Hospitals & ICU Centers ({filteredHospitals.length})
                </span>
              </div>

              {filteredHospitals.length === 0 ? (<p className="text-xs text-slate-400 italic p-3 bg-slate-50 rounded-xl border border-slate-200">
                  No hospitals matched in {selectedCity}.
                </p>) : (filteredHospitals.map((h) => {
                const isSelected = selectedHospital?.id === h.id;
                return (<div key={h.id} onClick={() => handleHospitalClick(h)} className={`p-3.5 rounded-xl border transition-all cursor-pointer ${isSelected
                        ? 'bg-blue-50/70 border-blue-300 shadow-xs ring-1 ring-blue-300'
                        : 'bg-white border-slate-200 hover:border-blue-300 hover:bg-blue-50/20'}`}>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="font-bold text-slate-800 text-xs leading-tight">{h.name}</h4>
                          <p className="text-[11px] text-slate-500 mt-0.5">{h.address}, <strong className="text-slate-700">{h.city}</strong></p>
                        </div>
                        <div className="flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 px-1.5 py-0.5 rounded text-[11px] font-semibold shrink-0">
                          <Star className="w-3 h-3 fill-amber-500 text-amber-500"/>
                          <span>{h.rating}</span>
                        </div>
                      </div>

                      <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                        <span className="font-semibold text-emerald-700 text-[11px] bg-emerald-50 px-2 py-0.5 rounded">
                          {h.availableBeds} ICU Beds
                        </span>
                        {h.distance !== null && (<span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                            📍 {h.distance} km away
                          </span>)}
                        <a href={`tel:${h.phone}`} onClick={(e) => e.stopPropagation()} className="text-blue-600 hover:underline flex items-center gap-1 font-bold text-[11px]">
                          <Phone className="w-3 h-3"/>
                          <span>Call</span>
                        </a>
                      </div>
                    </div>);
            }))}
            </div>)}
        </div>
      </div>

      {/* Emergency Helpline Banner */}
      <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-rose-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-rose-100 text-rose-700 shrink-0">
            <PhoneCall className="w-5 h-5 animate-bounce"/>
          </div>
          <div>
            <p className="font-bold text-sm text-rose-900">National Emergency Medical Dispatch</p>
            <p className="text-rose-700">Dial <strong className="font-extrabold text-rose-900">112</strong> for emergency ambulance or immediate ICU routing.</p>
          </div>
        </div>
        <a href="tel:112" className="px-4 py-2 bg-rose-600 text-white font-bold rounded-xl shadow-xs hover:bg-rose-700 transition-colors shrink-0 text-xs">
          Call Emergency 112
        </a>
      </div>
    </div>);
};
