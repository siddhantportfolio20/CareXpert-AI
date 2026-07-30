import React from 'react';
export function Table({ columns, data, keyExtractor, emptyMessage = 'No records found.' }) {
    return (<div className="w-full overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-xs">
      <table className="w-full text-left text-sm text-slate-700">
        <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 border-b border-slate-200">
          <tr>
            {columns.map((col) => (<th key={col.key} className="px-5 py-3.5 font-semibold">
                {col.header}
              </th>))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {data.length === 0 ? (<tr>
              <td colSpan={columns.length} className="px-5 py-8 text-center text-slate-500 italic">
                {emptyMessage}
              </td>
            </tr>) : (data.map((item) => (<tr key={keyExtractor(item)} className="hover:bg-slate-50/80 transition-colors">
                {columns.map((col) => (<td key={col.key} className="px-5 py-4 whitespace-nowrap">
                    {col.render ? col.render(item) : item[col.key]}
                  </td>))}
              </tr>)))}
        </tbody>
      </table>
    </div>);
}
