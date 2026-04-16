import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useToast } from './ToastContext';
import api from '../lib/axios';

const AuthContext = createContext();

const USER_KEY = 'optistay_user';
const TOKEN_KEY = 'optistay_token';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  const clearSession = useCallback(() => {
    setUser(null);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
    delete api.defaults.headers.common.Authorization;
  }, []);

  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      const token = localStorage.getItem(TOKEN_KEY);
      if (!token) {
        if (!cancelled) setLoading(false);
        return;
      }

      api.defaults.headers.common.Authorization = `Bearer ${token}`;

      try {
        const { data } = await api.get('/api/user');
        if (cancelled) return;
        setUser(data);
        localStorage.setItem(USER_KEY, JSON.stringify(data));
      } catch {
        if (!cancelled) clearSession();
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    init();
    return () => {
      cancelled = true;
    };
  }, [clearSession]);

  const persistSession = useCallback((nextUser, token) => {
    setUser(nextUser);
    localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
    localStorage.setItem(TOKEN_KEY, token);
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  }, []);

  const ensureCsrf = useCallback(async () => {
    await api.get('/sanctum/csrf-cookie');
  }, []);

  const login = async (email, password) => {
    await ensureCsrf();
    const { data } = await api.post('/api/auth/login', { email, password });
    const { user: nextUser, token } = data;
    if (!nextUser || !token) {
      throw new Error('Invalid response from server');
    }
    persistSession(nextUser, token);
    addToast(`Welcome back, ${nextUser.name || nextUser.email}!`, 'success');
    return nextUser;
  };

  const register = async ({ name, email, password, role = 'receptionist' }) => {
    await ensureCsrf();
    const { data } = await api.post('/api/auth/register', {
      name,
      email,
      password,
      password_confirmation: password,
      role,
    });
    const { user: nextUser, token } = data;
    if (!nextUser || !token) {
      throw new Error('Invalid response from server');
    }
    persistSession(nextUser, token);
    addToast('Account created successfully.', 'success');
    return nextUser;
  };

  const logout = async () => {
    try {
      await ensureCsrf();
      await api.post('/api/logout');
    } catch {
      // still clear local session
    } finally {
      clearSession();
      addToast('Successfully logged out.', 'success');
    }
  };

  const resetPassword = async (email) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!email.includes('@')) {
          reject(new Error('Invalid email format'));
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
          reject(new Error('All fields are required'));
          return;
        }
        resolve(true);
      }, 1500);
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        resetPassword,
        contactUs,
        ensureCsrf,
      }}
    >
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
