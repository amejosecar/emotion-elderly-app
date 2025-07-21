//src/contexts/AuthContext.tsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axios';

type AuthContextType = {
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expired = payload.exp && payload.exp * 1000 < Date.now();
      if (expired) {
        localStorage.removeItem("access_token");
      } else {
        setIsAuthenticated(true);
      }
    } catch {
      localStorage.removeItem("access_token");
    }
  }, []);

  const login = (token: string) => {
    localStorage.setItem("access_token", token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
};
