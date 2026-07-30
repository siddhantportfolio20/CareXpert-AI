import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';
export const Calendar = ({ availableSlots = ['09:00 AM', '10:30 AM', '02:00 PM', '03:30 PM', '05:00 PM'], selectedDate, selectedSlot, onSelectDate, onSelectSlot }) => {
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
    const [dateVal, setDateVal] = useState(selectedDate || tomorrow);
    const handleDateChange = (e) => {
        const val = e.target.value;
        setDateVal(val);
        onSelectDate(val);
    };
    return (<div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-800 font-bold text-sm tracking-tight">
          <CalendarIcon className="w-4 h-4 text-blue-600"/>
          <span>Select Date & Time Slot</span>
        </div>
      </div>

      {/* Date Picker Input */}
      <div>
        <label className="block text-xs font-semibold text-slate-600 mb-1">Consultation Date</label>
        <input type="date" min={new Date().toISOString().split('T')[0]} value={dateVal} onChange={handleDateChange} className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl px-3.5 py-2.5 outline-none focus:border-blue-500 focus:bg-white"/>
      </div>

      {/* Time Slots Grid */}
      <div>
        <label className="block text-xs font-semibold text-slate-600 mb-2 flex items-center gap-1">
          <Clock className="w-3.5 h-3.5 text-emerald-600"/>
          <span>Available Time Slots</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {availableSlots.map(slot => {
            const isSelected = selectedSlot === slot;
            return (<button key={slot} type="button" onClick={() => onSelectSlot(slot)} className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${isSelected
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-blue-300 hover:bg-blue-50/50'}`}>
                {slot}
              </button>);
        })}
        </div>
      </div>
    </div>);
};
