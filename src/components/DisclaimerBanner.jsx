import React, { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';
export const DisclaimerBanner = () => {
    const [dismissed, setDismissed] = useState(false);
    if (dismissed)
        return null;
    return (<div className="bg-gradient-to-r from-amber-600 via-amber-500 to-orange-600 text-white px-4 py-2.5 shadow-md relative z-50 text-xs font-medium border-b border-amber-700">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 pr-8 sm:pr-0">
        <div className="flex items-start sm:items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-amber-700/60 shrink-0 mt-0.5 sm:mt-0">
            <AlertTriangle className="w-4 h-4 text-amber-100"/>
          </div>
          <div className="space-y-0.5 leading-snug">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-amber-900/80 text-amber-200 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded tracking-wider border border-amber-700">
                Trial Project Notice
              </span>
              <span className="bg-rose-950/80 text-rose-200 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded tracking-wider border border-rose-800">
                Medical Disclaimer
              </span>
            </div>
            <p className="text-amber-50 text-[11px] sm:text-xs">
              <strong>This is a trial project.</strong> AI reports, diagnostic triage, and digital records are strictly for demonstration & informational purposes and do <strong>NOT</strong> constitute an official medical report or diagnosis. Always <strong>consult a licensed doctor</strong> or certified medical professional for real clinical decisions.
            </p>
          </div>
        </div>

        <button onClick={() => setDismissed(true)} className="absolute right-3 top-2.5 sm:static p-1 rounded-lg hover:bg-amber-700/50 text-amber-100 transition-colors shrink-0" title="Dismiss Disclaimer Notice">
          <X className="w-4 h-4"/>
        </button>
      </div>
    </div>);
};
