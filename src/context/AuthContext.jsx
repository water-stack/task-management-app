// context/AuthContext.js
import React, { createContext, useState, useEffect } from "react";
import { apiService } from "../services/api";
import { pushService } from "../services/push";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check for existing token on app load
  useEffect(() => {
    const initializeAuth = async () => {
      const token = apiService.getToken();
      if (token) {
        try {
          await verifyToken();
        } catch (error) {
          console.error('Token verification failed:', error);
          apiService.logout();
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (username, password) => {
    try {
      setError(null);
      const response = await apiService.login({ username, password });

      if (response.success) {
        apiService.setToken(response.token);
        setUser(response.user);
        // Try to subscribe for push notifications (non-blocking)
        try {
          await pushService.ensureSubscribed();
        } catch (e) {
          console.warn('Push subscription skipped:', e?.message || e);
        }
        return { success: true };
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      const errorMessage = error.message || 'Login failed';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    }
  };

  const signup = async (username, email, password) => {
    try {
      setError(null);
      const response = await apiService.register({ username, email, password });

      if (response.success) {
        apiService.setToken(response.token);
        setUser(response.user);
        // Try to subscribe for push notifications (non-blocking)
        try {
          await pushService.ensureSubscribed();
        } catch (e) {
          console.warn('Push subscription skipped:', e?.message || e);
        }
        return { success: true };
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      const errorMessage = error.message || 'Registration failed';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    }
  };

  const verifyToken = async () => {
    try {
      const response = await apiService.verifyToken();
      if (response.success) {
        setUser(response.user);
        // Ensure push subscription after token verification (non-blocking)
        try {
          await pushService.ensureSubscribed();
        } catch (e) {
          console.warn('Push subscription skipped:', e?.message || e);
        }
      } else {
        throw new Error('Token verification failed');
      }
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await pushService.unsubscribePush();
    } catch (_) {
      // ignore push unsubscribe errors during logout
    }
    apiService.logout();
    setUser(null);
    setError(null);
  };

  const value = {
    user,
    login,
    signup,
    logout,
    verifyToken,
    loading,
    error,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}