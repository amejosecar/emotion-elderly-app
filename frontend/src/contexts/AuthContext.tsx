// src/contexts/AuthContext.tsx

import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";

type DecodedToken = {
  sub: string;
  exp?: number;
  iat?: number;
  // añade aquí más campos si tu token los incluye
};

type User = {
  id: string;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Decodifica sin librerías externas.
 * Al separar el token en 3 partes y hacer atob sobre la segunda,
 * obtenemos el JSON del payload.
 */
function parseJwt(token: string): DecodedToken {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(json);
  } catch {
    throw new Error("Invalid token format");
  }
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (token: string) => {
    localStorage.setItem("access_token", token);
    try {
      const payload = parseJwt(token);
      setUser({ id: payload.sub });
    } catch (err) {
      console.error("Error al parsear token en AuthProvider:", err);
      logout();
    }
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    setUser(null);
  };

  // Al montar, comprobamos si hay token y lo parseamos
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      login(token);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }
  return ctx;
};
