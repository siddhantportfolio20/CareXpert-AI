import React, { useState, useEffect } from 'react';
import { GoogleMaps } from '../components/GoogleMaps';
import { SearchBar } from '../components/SearchBar';
import { HospitalMapSkeleton } from '../components/SkeletonLoader';
import axios from 'axios';
export const HospitalSearchPage = () => {
    const [hospitals, setHospitals] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isFetching, setIsFetching] = useState(true);
    useEffect(() => {
        fetchHospitals();
    }, []);
    const fetchHospitals = async () => {
        setIsFetching(true);
        try {
            const res = await axios.get('/api/hospitals');
            if (res.data.success)
                setHospitals(res.data.hospitals || []);
        }
        catch (err) {
            console.warn('Hospital fetch error:', err);
        }
        finally {
            setIsFetching(false);
        }
    };
    const filteredHospitals = hospitals.filter(h => h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.address.toLowerCase().includes(searchQuery.toLowerCase()));
    return (<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-black text-white">Nearby Hospital & Emergency Network</h1>
        <p className="text-sm text-slate-400">Discover hospitals, check live ICU bed availability, and navigate with Google Maps.</p>
      </div>

      <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Filter hospitals by city, name, or facility address..."/>

      {isFetching ? (<HospitalMapSkeleton />) : (<GoogleMaps hospitals={filteredHospitals}/>)}
    </div>);
};
