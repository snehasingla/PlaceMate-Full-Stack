// src/context/AuthContext.jsx
// Global authentication state — stores user info and provides login/logout/register functions

import { createContext, useContext, useState, useEffect } from "react";
import authService from "../services/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // true while checking if user is already logged in

  // On app load, check if there's an active session (valid cookie)
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const data = await authService.getMe();
        setUser(data);
      } catch {
        setUser(null); // Not logged in
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const register = async (userData) => {
    const data = await authService.register(userData);
    setUser(data);
    return data;
  };

  const login = async (userData) => {
    const data = await authService.login(userData);
    setUser(data);
    return data;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const updateUser = (updatedData) => {
    setUser((prev) => ({ ...prev, ...updatedData }));
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook — use this everywhere instead of useContext(AuthContext)
export const useAuth = () => useContext(AuthContext);
