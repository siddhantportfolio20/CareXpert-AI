import React from 'react';
export const Dropdown = ({ label, options, error, className = '', id, ...props }) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
    return (<div className="w-full space-y-1.5">
      {label && (<label htmlFor={selectId} className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
          {label}
        </label>)}
      <select id={selectId} className={`w-full bg-slate-50 border ${error ? 'border-rose-500' : 'border-slate-200 focus:border-blue-500'} rounded-xl text-slate-800 text-sm py-2.5 px-3.5 transition-all outline-none focus:ring-2 focus:ring-blue-500 ${className}`} {...props}>
        {options.map((opt) => (<option key={opt.value} value={opt.value} className="bg-white text-slate-800">
            {opt.label}
          </option>))}
      </select>
      {error && <p className="text-xs text-rose-600 font-medium">{error}</p>}
    </div>);
};
