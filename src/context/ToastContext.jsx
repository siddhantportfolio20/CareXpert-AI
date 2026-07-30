import React, { createContext, useContext, useState } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';
const ToastContext = createContext(undefined);
export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);
    const showToast = (title, message, type = 'info') => {
        const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
        const newToast = { id, type, title, message };
        setToasts(prev => [...prev, newToast]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 4500);
    };
    const removeToast = (id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };
    return (<ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full px-4 pointer-events-none">
        {toasts.map(toast => {
            const bgColors = {
                success: 'bg-emerald-900/90 border-emerald-500 text-emerald-100',
                error: 'bg-rose-900/90 border-rose-500 text-rose-100',
                warning: 'bg-amber-900/90 border-amber-500 text-amber-100',
                info: 'bg-slate-900/90 border-cyan-500 text-slate-100'
            };
            const Icons = {
                success: <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0"/>,
                error: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0"/>,
                warning: <AlertCircle className="w-5 h-5 text-amber-400 shrink-0"/>,
                info: <Info className="w-5 h-5 text-cyan-400 shrink-0"/>
            };
            return (<div key={toast.id} className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-xl backdrop-blur-md transition-all duration-300 animate-in slide-in-from-bottom-2 ${bgColors[toast.type]}`}>
              {Icons[toast.type]}
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold leading-tight">{toast.title}</h4>
                {toast.message && <p className="text-xs text-slate-300 mt-1">{toast.message}</p>}
              </div>
              <button onClick={() => removeToast(toast.id)} className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors">
                <X className="w-4 h-4"/>
              </button>
            </div>);
        })}
      </div>
    </ToastContext.Provider>);
};
export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};
