import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Activity, Bell, Sun, Moon, LogOut, User, ChevronDown, Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import axios from 'axios';
export const Navbar = ({ onToggleSidebar }) => {
    const { user, logout, switchDemoRole, darkMode, toggleDarkMode } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();
    const location = useLocation();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showNotifs, setShowNotifs] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const token = localStorage.getItem('carexpert_token');
                if (!token)
                    return;
                const res = await axios.get('/api/notifications', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.data.success) {
                    setNotifications(res.data.notifications || []);
                    setUnreadCount(res.data.unreadCount || 0);
                }
            }
            catch (err) {
                // silent handling
            }
        };
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 15000);
        return () => clearInterval(interval);
    }, [user]);
    const handleMarkRead = async (id) => {
        try {
            const token = localStorage.getItem('carexpert_token');
            await axios.put(`/api/notifications/${id}/read`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        }
        catch (err) {
            // silent
        }
    };
    const handleRoleSwitch = async (role) => {
        try {
            await switchDemoRole(role);
            showToast('Role Switched', `Switched active preview role to ${role}`, 'success');
            if (role === 'Admin')
                navigate('/admin');
            else if (role === 'Doctor')
                navigate('/doctor');
            else
                navigate('/patient');
        }
        catch (err) {
            showToast('Error', 'Failed to switch role', 'error');
        }
    };
    return (<header className="sticky top-0 z-40 bg-white/95 border-b border-slate-200 backdrop-blur-md shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle & Brand */}
        <div className="flex items-center gap-3">
          <button onClick={onToggleSidebar} className="md:hidden text-slate-500 hover:text-slate-800 p-2 rounded-xl hover:bg-slate-100 transition-colors">
            <Menu className="w-5 h-5"/>
          </button>

          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="p-2 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 group-hover:scale-105 transition-transform shadow-xs">
              <Activity className="w-5 h-5"/>
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-slate-800">CareXpert<span className="text-blue-600">AI</span></span>
              <span className="hidden sm:inline-block ml-2 text-[10px] font-bold tracking-widest text-emerald-700 uppercase bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Health Platform
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Navigation Links for desktop */}
        <nav className="hidden md:flex items-center gap-1">
          <Link to="/" className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${location.pathname === '/' ? 'text-blue-600 bg-blue-50 border border-blue-100' : 'text-slate-600 hover:text-slate-900'}`}>
            Home
          </Link>
          <Link to="/doctors" className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${location.pathname === '/doctors' ? 'text-blue-600 bg-blue-50 border border-blue-100' : 'text-slate-600 hover:text-slate-900'}`}>
            Search Doctors
          </Link>
          <Link to="/hospitals" className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${location.pathname === '/hospitals' ? 'text-blue-600 bg-blue-50 border border-blue-100' : 'text-slate-600 hover:text-slate-900'}`}>
            Nearby Hospitals
          </Link>
          {user && (<Link to={user.role === 'Admin' ? '/admin' : user.role === 'Doctor' ? '/doctor' : '/patient'} className="px-3 py-1.5 rounded-xl text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 hover:bg-blue-100 transition-colors">
              Dashboard ({user.role})
            </Link>)}
        </nav>

        {/* Right: Quick Demo Role Switcher, Notifications, Dark Mode, Profile */}
        <div className="flex items-center gap-2.5">
          {/* Quick Demo Role Switcher Pill */}
          <div className="hidden lg:flex items-center bg-slate-100 border border-slate-200 rounded-xl p-1 text-xs">
            <span className="text-[10px] uppercase font-bold text-slate-500 px-2">Role:</span>
            {['Patient', 'Doctor', 'Admin'].map(role => (<button key={role} onClick={() => handleRoleSwitch(role)} className={`px-2.5 py-1 rounded-lg font-medium transition-all ${user?.role === role
                ? 'bg-blue-600 text-white font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'}`}>
                {role}
              </button>))}
          </div>

          {/* Theme Toggle */}
          <button onClick={toggleDarkMode} className="p-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 transition-colors" title="Toggle Theme">
            {darkMode ? <Sun className="w-4 h-4 text-amber-500"/> : <Moon className="w-4 h-4 text-slate-600"/>}
          </button>

          {/* Notifications Drawer Toggle */}
          {user && (<div className="relative">
              <button onClick={() => setShowNotifs(!showNotifs)} className="relative p-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 transition-colors">
                <Bell className="w-4 h-4"/>
                {unreadCount > 0 && (<span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-[10px] font-bold text-white flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>)}
              </button>

              {/* Notifications Popover */}
              {showNotifs && (<div className="absolute right-0 mt-3 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden z-50 animate-in fade-in duration-200">
                  <div className="p-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">Notifications</h4>
                    <span className="text-[10px] bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full font-semibold">
                      {unreadCount} Unread
                    </span>
                  </div>
                  <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
                    {notifications.length === 0 ? (<p className="p-4 text-center text-xs text-slate-500 italic">No notifications yet.</p>) : (notifications.map(n => (<div key={n.id} onClick={() => handleMarkRead(n.id)} className={`p-3 text-xs cursor-pointer transition-colors ${n.isRead ? 'opacity-60 hover:opacity-100 bg-white' : 'bg-blue-50/40 hover:bg-blue-50/80'}`}>
                          <div className="flex items-center justify-between gap-1">
                            <span className="font-semibold text-slate-800">{n.title}</span>
                            {!n.isRead && <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0"/>}
                          </div>
                          <p className="text-slate-600 mt-0.5">{n.message}</p>
                          <span className="text-[9px] text-slate-400 mt-1 block">
                            {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>)))}
                  </div>
                </div>)}
            </div>)}

          {/* User Profile Menu */}
          {user ? (<div className="relative">
              <button onClick={() => setShowUserMenu(!showUserMenu)} className="flex items-center gap-2 p-1.5 bg-slate-100 border border-slate-200 rounded-xl hover:border-slate-300 transition-colors">
                <img src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80'} alt={user.name} className="w-7 h-7 rounded-lg object-cover"/>
                <span className="hidden sm:inline-block text-xs font-semibold text-slate-800 max-w-[100px] truncate">
                  {user.name}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500"/>
              </button>

              {showUserMenu && (<div className="absolute right-0 mt-3 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 z-50 animate-in fade-in duration-200 space-y-1 text-xs">
                  <div className="p-2 border-b border-slate-100">
                    <p className="font-bold text-slate-800 truncate">{user.name}</p>
                    <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
                    <span className="inline-block mt-1 text-[9px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                      {user.role} Account
                    </span>
                  </div>

                  <Link to="/profile" onClick={() => setShowUserMenu(false)} className="flex items-center gap-2 px-3 py-2 text-slate-700 hover:text-blue-600 hover:bg-slate-50 rounded-xl transition-colors">
                    <User className="w-4 h-4 text-blue-600"/>
                    <span>My Profile</span>
                  </Link>

                  <button onClick={() => {
                    logout();
                    setShowUserMenu(false);
                    showToast('Logged Out', 'Signed out of platform', 'info');
                    navigate('/auth');
                }} className="w-full flex items-center gap-2 px-3 py-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors text-left font-medium">
                    <LogOut className="w-4 h-4"/>
                    <span>Sign Out</span>
                  </button>
                </div>)}
            </div>) : (<Link to="/auth" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-all">
              Sign In
            </Link>)}
        </div>
      </div>
    </header>);
};
