import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
const AuthContext = createContext(undefined);
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('carexpert_token'));
    const [loading, setLoading] = useState(true);
    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem('carexpert_theme') === 'dark' || false; // Clean light theme as default
    });
    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('carexpert_theme', 'dark');
        }
        else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('carexpert_theme', 'light');
        }
    }, [darkMode]);
    const toggleDarkMode = () => setDarkMode(prev => !prev);
    useEffect(() => {
        const fetchMe = async () => {
            if (!token) {
                // Auto initialize default demo patient account for immediate working preview
                try {
                    const res = await axios.post('/api/auth/login', { email: 'patient@carexpert.ai', password: 'password' });
                    if (res.data.success) {
                        setToken(res.data.token);
                        setUser(res.data.user);
                        localStorage.setItem('carexpert_token', res.data.token);
                    }
                }
                catch (e) {
                    console.warn('Default auth initialization warning');
                }
                setLoading(false);
                return;
            }
            try {
                const res = await axios.get('/api/auth/me', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.data.success) {
                    setUser(res.data.user);
                }
            }
            catch (err) {
                console.warn('Failed to verify stored token, resetting auth state.');
                localStorage.removeItem('carexpert_token');
                setToken(null);
                setUser(null);
            }
            finally {
                setLoading(false);
            }
        };
        fetchMe();
    }, [token]);
    const login = async (email, password = 'password') => {
        const res = await axios.post('/api/auth/login', { email, password });
        if (res.data.success) {
            setToken(res.data.token);
            setUser(res.data.user);
            localStorage.setItem('carexpert_token', res.data.token);
        }
    };
    const registerUser = async (data) => {
        const res = await axios.post('/api/auth/register', data);
        if (res.data.success) {
            setToken(res.data.token);
            setUser(res.data.user);
            localStorage.setItem('carexpert_token', res.data.token);
        }
    };
    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('carexpert_token');
    };
    const switchDemoRole = async (role) => {
        const emailMap = {
            Patient: 'patient@carexpert.ai',
            Doctor: 'doctor@carexpert.ai',
            Admin: 'admin@carexpert.ai'
        };
        await login(emailMap[role], 'password');
    };
    const updateUser = async (updates) => {
        if (!token)
            return;
        const res = await axios.put('/api/auth/profile', updates, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.success) {
            setUser(res.data.user);
        }
    };
    return (<AuthContext.Provider value={{
            user,
            token,
            loading,
            darkMode,
            toggleDarkMode,
            login,
            registerUser,
            logout,
            switchDemoRole,
            updateUser
        }}>
      {children}
    </AuthContext.Provider>);
};
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
