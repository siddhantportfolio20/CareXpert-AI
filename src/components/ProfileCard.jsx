import React from 'react';
import { Phone, Mail, MapPin, ShieldCheck } from 'lucide-react';
import { Badge } from './Badge';
export const ProfileCard = ({ user, onEdit }) => {
    const isDoctor = user.role === 'Doctor';
    const doc = isDoctor ? user : null;
    return (<div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs relative overflow-hidden">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
        <div className="relative">
          <img src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80'} alt={user.name} className="w-20 h-20 rounded-2xl object-cover border-2 border-slate-100 shadow-xs"/>
          <div className="absolute -bottom-1 -right-1 bg-emerald-600 p-1 rounded-full border-2 border-white text-white">
            <ShieldCheck className="w-3.5 h-3.5"/>
          </div>
        </div>

        <div className="flex-1 text-center sm:text-left min-w-0">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
            <div>
              <h2 className="text-xl font-bold text-slate-800 tracking-tight">{user.name}</h2>
              <p className="text-xs text-blue-600 font-semibold">{isDoctor ? doc?.specialization : `Role: ${user.role}`}</p>
            </div>
            <Badge variant={user.role === 'Admin' ? 'danger' : isDoctor ? 'info' : 'success'}>
              {user.role} Account
            </Badge>
          </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-600">
            <div className="flex items-center gap-2 text-slate-600">
              <Mail className="w-3.5 h-3.5 text-blue-600 shrink-0"/>
              <span className="truncate">{user.email}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0"/>
              <span>{user.phone || '+1 (555) 000-0000'}</span>
            </div>
            {user.address && (<div className="flex items-center gap-2 text-slate-600 col-span-1 sm:col-span-2">
                <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0"/>
                <span className="truncate">{user.address}</span>
              </div>)}
          </div>

          {!isDoctor && (<div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap gap-4 text-xs text-slate-600">
              <div>
                <span className="text-slate-400">Age: </span>
                <span className="font-semibold text-slate-800">{user.age || 30} yrs</span>
              </div>
              <div>
                <span className="text-slate-400">Gender: </span>
                <span className="font-semibold text-slate-800">{user.gender || 'Male'}</span>
              </div>
              <div>
                <span className="text-slate-400">Blood Group: </span>
                <span className="font-semibold text-rose-600">{user.bloodGroup || 'O+'}</span>
              </div>
            </div>)}
        </div>
      </div>
    </div>);
};
