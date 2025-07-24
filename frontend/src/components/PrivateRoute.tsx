// src/components/PrivateRoute.tsx
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const token = localStorage.getItem("access_token");

  // Puedes agregar lógica adicional si el token debe ser validado
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
