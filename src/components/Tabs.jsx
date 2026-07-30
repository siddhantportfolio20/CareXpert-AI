import React from 'react';
export const Tabs = ({ tabs, activeTab, onChange }) => {
    return (<div className="flex border-b border-slate-200 space-x-2 overflow-x-auto">
      {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (<button key={tab.id} onClick={() => onChange(tab.id)} className={`flex items-center gap-2 py-3 px-4 font-semibold text-xs border-b-2 transition-all whitespace-nowrap cursor-pointer ${isActive
                    ? 'border-blue-600 text-blue-600 bg-blue-50/50'
                    : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'}`}>
            {tab.icon}
            <span>{tab.label}</span>
            {tab.badgeCount !== undefined && tab.badgeCount > 0 && (<span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${isActive ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                {tab.badgeCount}
              </span>)}
          </button>);
        })}
    </div>);
};
