import { createContext, useContext, useEffect, useState } from 'react';
import { DEMO_USER } from '../utils/demoData';
import { STORAGE_KEYS } from '../utils/constants';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.AUTH);
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch { /* ignore */ }
    }
    setLoading(false);
  }, []);

  const login = (email) => {
    const loggedInUser = { ...DEMO_USER, email: email || DEMO_USER.email };
    setUser(loggedInUser);
    localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(loggedInUser));
    return loggedInUser;
  };

  const register = (name, email) => {
    const newUser = { id: `user-${Date.now()}`, name, email };
    setUser(newUser);
    localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(newUser));
    return newUser;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEYS.AUTH);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
