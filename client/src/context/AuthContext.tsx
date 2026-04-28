import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user';
  gender?: string;
  avatar: string;
  phone?: string;
  address?: string;
  created_at?: string;
}

interface LoginResult  { success: boolean; message: string; role?: string; }

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<LoginResult>;
  register: (name: string, email: string, password: string, gender: string, avatar: string) => Promise<LoginResult>;
  logout: () => void;
  isAdmin: boolean;
  refreshUser: () => void;
}

const BASE = 'http://localhost:5000/api';
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchMe = async () => {
    const token = localStorage.getItem('token');
    if (!token) { setLoading(false); return; }
    try {
      const res = await fetch(`${BASE}/auth/me`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) { const d = await res.json(); setUser(d); }
      else localStorage.removeItem('token');
    } catch { localStorage.removeItem('token'); }
    setLoading(false);
  };

  useEffect(() => { fetchMe(); }, []);

  const login = async (email: string, password: string): Promise<LoginResult> => {
    try {
      const res  = await fetch(`${BASE}/auth/login`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ email, password }) });
      const data = await res.json();
      if (!res.ok) return { success: false, message: data.message || 'Login failed' };
      localStorage.setItem('token', data.token);
      setUser(data.user);
      return { success: true, message: 'Welcome back!', role: data.user.role };
    } catch { return { success: false, message: 'Cannot connect to server. Is it running?' }; }
  };

  const register = async (name: string, email: string, password: string, gender: string, avatar: string): Promise<LoginResult> => {
    try {
      const res  = await fetch(`${BASE}/auth/register`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ name, email, password, gender, avatar }) });
      const data = await res.json();
      if (!res.ok) return { success: false, message: data.message || 'Registration failed' };
      localStorage.setItem('token', data.token);
      setUser(data.user);
      return { success: true, message: 'Account created!', role: data.user.role };
    } catch { return { success: false, message: 'Cannot connect to server. Is it running?' }; }
  };

  const logout = () => { localStorage.removeItem('token'); setUser(null); };
  const refreshUser = () => fetchMe();

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAdmin: user?.role === 'admin', refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}