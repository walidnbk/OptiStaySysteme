import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    // Check locally attached session
    const storoseUser = localStorage.getItem('optistay_user');
    if (storoseUser) {
      setUser(JSON.parse(storoseUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password, role) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!email || !password) {
          reject(new Error("Email and password are required"));
          return;
        }

        const newUser = {
          id: Math.random().toString(36).substring(7),
          name: email.split('@')[0].replace('.', ' '),
          email: email,
          role: role,
        };

        setUser(newUser);
        localStorage.setItem('optistay_user', JSON.stringify(newUser));
        addToast(`Welcome back! Logged in as ${role}`, 'success');
        resolve(newUser);
      }, 1200);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('optistay_user');
    addToast('Successfully logged out.', 'success');
  };

  const resetPassword = async (email) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!email.includes('@')) {
          reject(new Error("Invalid email format"));
          return;
        }
        resolve(true);
      }, 1500);
    });
  };

  const contactUs = async (data) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!data.name || !data.email || !data.message) {
          reject(new Error("All fields are required"));
          return;
        }
        resolve(true);
      }, 1500);
    });
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, resetPassword, contactUs }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
