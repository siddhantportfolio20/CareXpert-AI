import React from 'react';
export const Card = ({ children, className = '', header, footer }) => {
    return (<div className={`bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden transition-all duration-200 hover:border-slate-300 hover:shadow-sm ${className}`}>
      {header && <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">{header}</div>}
      <div className="p-6">{children}</div>
      {footer && <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/50 text-xs text-slate-500">{footer}</div>}
    </div>);
};
