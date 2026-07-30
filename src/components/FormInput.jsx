import React from 'react';
export const FormInput = ({ label, error, icon, helperText, className = '', id, ...props }) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
    return (<div className="w-full space-y-1.5">
      {label && (<label htmlFor={inputId} className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
          {label}
        </label>)}
      <div className="relative rounded-xl shadow-xs">
        {icon && (<div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            {icon}
          </div>)}
        <input id={inputId} className={`w-full bg-slate-50 border ${error ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-200 focus:border-blue-500 focus:ring-blue-500 focus:bg-white'} rounded-xl text-slate-800 placeholder-slate-400 text-sm py-2.5 ${icon ? 'pl-10' : 'pl-3.5'} pr-3.5 transition-all outline-none focus:ring-1 ${className}`} {...props}/>
      </div>
      {error && <p className="text-xs text-rose-600 font-medium mt-1">{error}</p>}
      {helperText && !error && <p className="text-xs text-slate-500 mt-1">{helperText}</p>}
    </div>);
};
