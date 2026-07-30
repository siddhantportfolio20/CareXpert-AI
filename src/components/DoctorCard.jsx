import React from 'react';
import { Star, MapPin, Award, Calendar, DollarSign, Clock } from 'lucide-react';
import { Button } from './Button';
export const DoctorCard = ({ doctor, onBookAppointment }) => {
    return (<div className="bg-white border border-slate-200 hover:border-blue-300 rounded-xl p-5 shadow-xs hover:shadow-sm transition-all duration-200 flex flex-col justify-between group">
      <div>
        <div className="flex items-start gap-4">
          <img src={doctor.avatar || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&auto=format&fit=crop&q=80'} alt={doctor.name} className="w-16 h-16 rounded-xl object-cover border border-slate-100 shadow-xs group-hover:scale-105 transition-transform"/>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-1">
              <h3 className="font-bold text-slate-800 text-base truncate group-hover:text-blue-600 transition-colors">
                {doctor.name}
              </h3>
              <div className="flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-md text-xs font-semibold shrink-0">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500"/>
                <span>{doctor.rating}</span>
                <span className="text-amber-600/70 font-normal">({doctor.reviewsCount})</span>
              </div>
            </div>
            <p className="text-xs font-semibold text-blue-600 mt-0.5">{doctor.specialization}</p>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1 truncate">
              <Award className="w-3.5 h-3.5 text-slate-400 shrink-0"/>
              {doctor.qualification} ({doctor.experienceYears}+ yrs exp)
            </p>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-600">
          <div className="flex items-start gap-2 text-slate-500">
            <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5"/>
            <span className="line-clamp-1">{doctor.clinicAddress}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-slate-500">
              <Clock className="w-3.5 h-3.5 text-emerald-600"/>
              <span>Available: {doctor.availability.days.join(', ')}</span>
            </div>
            <div className="flex items-center text-slate-900 font-bold text-sm">
              <DollarSign className="w-3.5 h-3.5 -mr-0.5 text-slate-500"/>
              <span>{doctor.consultationFee}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 pt-3 border-t border-slate-100">
        <Button onClick={() => onBookAppointment(doctor)} variant="primary" size="sm" className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-xs" icon={<Calendar className="w-4 h-4"/>}>
          Book Consultation
        </Button>
      </div>
    </div>);
};
