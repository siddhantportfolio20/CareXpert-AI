import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
export const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1)
        return null;
    return (<div className="flex items-center justify-between px-4 py-3 bg-white border border-slate-200 rounded-xl">
      <p className="text-xs text-slate-500">
        Page <span className="font-semibold text-slate-800">{currentPage}</span> of{' '}
        <span className="font-semibold text-slate-800">{totalPages}</span>
      </p>
      <div className="flex gap-2">
        <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed">
          <ChevronLeft className="w-4 h-4"/>
        </button>
        <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed">
          <ChevronRight className="w-4 h-4"/>
        </button>
      </div>
    </div>);
};
