import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#6366f1'];
export const Charts = ({ analytics }) => {
    return (<div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Monthly Revenue Chart */}
      <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-slate-800 text-base tracking-tight">Monthly Platform Revenue ($)</h3>
            <p className="text-xs text-slate-500">Financial consultation trends</p>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
            Upward Revenue
          </span>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={analytics.monthlyRevenue}>
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false}/>
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false}/>
              <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', color: '#1e293b', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}/>
              <Bar dataKey="revenue" fill="#2563eb" radius={[6, 6, 0, 0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Appointment Status Distribution */}
      <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-slate-800 text-base tracking-tight">Appointment Distribution</h3>
          <p className="text-xs text-slate-500">Real-time status breakdown</p>
        </div>
        <div className="h-52 w-full my-2">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={analytics.appointmentStatusBreakdown} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={4} dataKey="value">
                {analytics.appointmentStatusBreakdown.map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', color: '#1e293b', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs border-t border-slate-100 pt-3">
          {analytics.appointmentStatusBreakdown.map((item, idx) => (<div key={item.name} className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[idx % COLORS.length] }}/>
              <span className="text-slate-600 font-medium truncate">{item.name}: {item.value}</span>
            </div>))}
        </div>
      </div>
    </div>);
};
