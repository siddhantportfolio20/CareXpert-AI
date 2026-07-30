import { db } from '../db.js';
export const getHospitals = async (req, res) => {
    try {
        const { lat, lng, search, specialty } = req.query;
        let hospitals = db.get('hospitals');
        if (search) {
            const q = search.toLowerCase();
            hospitals = hospitals.filter(h => h.name.toLowerCase().includes(q) || h.city.toLowerCase().includes(q));
        }
        if (specialty) {
            const spec = specialty.toLowerCase();
            hospitals = hospitals.filter(h => h.specialties.some(s => s.toLowerCase().includes(spec)));
        }
        if (lat && lng) {
            const userLat = Number(lat);
            const userLng = Number(lng);
            // Distance calculation (Haversine formula approximation)
            hospitals = hospitals.map(h => {
                const dLat = (h.latitude - userLat) * (Math.PI / 180);
                const dLng = (h.longitude - userLng) * (Math.PI / 180);
                const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                    Math.cos(userLat * (Math.PI / 180)) * Math.cos(h.latitude * (Math.PI / 180)) *
                        Math.sin(dLng / 2) * Math.sin(dLng / 2);
                const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                const distanceKm = 6371 * c;
                return { ...h, distanceKm: Math.round(distanceKm * 10) / 10 };
            }).sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0));
        }
        res.json({ success: true, count: hospitals.length, hospitals });
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
export const createHospital = async (req, res) => {
    try {
        const { name, address, city, phone, email, specialties, latitude, longitude, totalBeds, availableBeds, emergencyAvailable } = req.body;
        if (!name || !address || !city) {
            res.status(400).json({ success: false, message: 'Name, address, and city are required.' });
            return;
        }
        const hospitals = db.get('hospitals');
        const newHospital = {
            id: 'hosp-' + Date.now(),
            name,
            address,
            city,
            phone: phone || '+1 (555) 000-0000',
            email: email || 'contact@hospital.org',
            specialties: Array.isArray(specialties) ? specialties : ['General Medicine'],
            rating: 4.8,
            emergencyAvailable: emergencyAvailable !== undefined ? emergencyAvailable : true,
            latitude: latitude ? Number(latitude) : 37.7749,
            longitude: longitude ? Number(longitude) : -122.4194,
            totalBeds: totalBeds ? Number(totalBeds) : 100,
            availableBeds: availableBeds ? Number(availableBeds) : 20,
            image: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=800&auto=format&fit=crop&q=80'
        };
        hospitals.push(newHospital);
        db.save('hospitals', hospitals);
        res.status(201).json({ success: true, message: 'Hospital added successfully.', hospital: newHospital });
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
