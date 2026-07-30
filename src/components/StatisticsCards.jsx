import React from 'react';
import { Users, Stethoscope, Calendar, DollarSign, TrendingUp } from 'lucide-react';
export const StatisticsCards = ({ stats }) => {
    const cards = [
        {
            title: 'Total Patients',
            value: stats.totalPatients,
            icon: <Users className="w-5 h-5 text-blue-600"/>,
            change: '+14% this month',
            color: 'bg-white border-slate-200'
        },
        {
            title: 'Verified Doctors',
            value: stats.totalDoctors,
            icon: <Stethoscope className="w-5 h-5 text-emerald-600"/>,
            change: '100% active availability',
            color: 'bg-white border-slate-200'
        },
        {
            title: 'Appointments',
            value: stats.totalAppointments,
            icon: <Calendar className="w-5 h-5 text-amber-600"/>,
            change: `${stats.pendingAppointments} pending review`,
            color: 'bg-white border-slate-200'
        },
        {
            title: 'Revenue Engine',
            value: `$${stats.totalRevenue.toLocaleString()}`,
            icon: <DollarSign className="w-5 h-5 text-indigo-600"/>,
            change: '+22% growth',
            color: 'bg-white border-slate-200'
        }
    ];
    return (<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, i) => (<div key={i} className={`p-5 rounded-xl border shadow-xs transition-all hover:shadow-md hover:border-slate-300 ${card.color}`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{card.title}</span>
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">{card.icon}</div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">{card.value}</h3>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1 font-medium">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600"/>
              <span>{card.change}</span>
            </p>
          </div>
        </div>))}
    </div>);
};
