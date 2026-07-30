import React from 'react';
export const DoctorCardSkeleton = () => {
    return (<div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between animate-pulse">
      <div>
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-xl bg-slate-200 shrink-0"/>
          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <div className="h-5 bg-slate-200 rounded-md w-3/5"/>
              <div className="h-5 bg-slate-200 rounded-md w-12 shrink-0"/>
            </div>
            <div className="h-3 bg-slate-200 rounded-md w-2/5"/>
            <div className="h-3 bg-slate-200 rounded-md w-4/5"/>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 space-y-2.5">
          <div className="h-3 bg-slate-200 rounded-md w-full"/>
          <div className="flex items-center justify-between pt-1">
            <div className="h-3 bg-slate-200 rounded-md w-1/2"/>
            <div className="h-4 bg-slate-200 rounded-md w-12"/>
          </div>
        </div>
      </div>

      <div className="mt-5 pt-3 border-t border-slate-100">
        <div className="h-9 bg-slate-200 rounded-xl w-full"/>
      </div>
    </div>);
};
export const DoctorGridSkeleton = ({ count = 6 }) => {
    return (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (<DoctorCardSkeleton key={i}/>))}
    </div>);
};
export const HospitalMapSkeleton = () => {
    return (<div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-6 animate-pulse">
      {/* Header bar */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <div className="w-10 h-10 rounded-xl bg-slate-200 shrink-0"/>
          <div className="space-y-2 w-full">
            <div className="h-5 bg-slate-200 rounded-md w-64"/>
            <div className="h-3 bg-slate-200 rounded-md w-80"/>
          </div>
        </div>
        <div className="h-9 bg-slate-200 rounded-xl w-44 shrink-0"/>
      </div>

      {/* Filter tabs */}
      <div className="h-10 bg-slate-100 rounded-xl w-full"/>

      {/* Search Bar */}
      <div className="h-10 bg-slate-100 rounded-xl w-full"/>

      {/* Map + List Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Map placeholder */}
        <div className="lg:col-span-7 bg-slate-200 rounded-xl h-[380px] lg:h-[480px] flex items-center justify-center">
          <div className="text-slate-400 text-xs font-semibold tracking-wider uppercase flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-slate-300 animate-ping"/>
            <span>Loading Interactive Map Layer...</span>
          </div>
        </div>

        {/* List items placeholder */}
        <div className="lg:col-span-5 space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (<div key={i} className="p-4 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1.5 w-3/4">
                  <div className="h-4 bg-slate-200 rounded-md w-4/5"/>
                  <div className="h-3 bg-slate-200 rounded-md w-full"/>
                </div>
                <div className="h-5 bg-slate-200 rounded-md w-10 shrink-0"/>
              </div>
              <div className="flex gap-2">
                <div className="h-4 bg-slate-200 rounded-md w-16"/>
                <div className="h-4 bg-slate-200 rounded-md w-16"/>
              </div>
            </div>))}
        </div>
      </div>
    </div>);
};
