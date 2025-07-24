// src/components/PrivateRoute.tsx
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const token = localStorage.getItem("access_token");

  // Puedes agregar lógica adicional si el token debe ser validado
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;

// import React from "react";
// import { Navigate, Outlet } from "react-router-dom";
// import { useAuth } from "../contexts/AuthContext";

// const PrivateRoute: React.FC = () => {
//   const { isAuthenticated } = useAuth();
//   return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
// };

// export default PrivateRoute;
