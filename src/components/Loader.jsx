import React from 'react';
import { Activity } from 'lucide-react';
export const Loader = ({ message = 'Loading healthcare data...', size = 'md' }) => {
    const iconSizes = {
        sm: 'w-6 h-6',
        md: 'w-10 h-10',
        lg: 'w-14 h-14'
    };
    return (<div className="flex flex-col items-center justify-center p-8 gap-3 text-cyan-400">
      <div className="relative">
        <Activity className={`${iconSizes[size]} animate-pulse`}/>
        <div className="absolute inset-0 rounded-full border-2 border-cyan-500/30 animate-ping pointer-events-none"/>
      </div>
      {message && <p className="text-sm font-medium text-slate-400 tracking-wide">{message}</p>}
    </div>);
};
