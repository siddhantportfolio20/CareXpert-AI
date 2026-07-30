import React from 'react';
import { Search, X } from 'lucide-react';
export const SearchBar = ({ value, onChange, placeholder = 'Search doctors, hospitals, specializations...', onClear }) => {
    return (<div className="relative w-full">
      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"/>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full bg-white border border-slate-200 focus:border-blue-500 text-slate-800 placeholder-slate-400 text-sm rounded-xl pl-10 pr-9 py-2.5 outline-none transition-all focus:ring-2 focus:ring-blue-500 shadow-xs"/>
      {value && (<button onClick={() => {
                onChange('');
                if (onClear)
                    onClear();
            }} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 rounded-lg">
          <X className="w-4 h-4"/>
        </button>)}
    </div>);
};
