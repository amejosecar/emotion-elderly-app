// 📄 src/pages/Dashboard.tsx

import React from "react";
import { useAuth } from "../contexts/AuthContext";
import EmotionDistributionChart from "../components/Dashboard/EmotionDistributionChart";

const Dashboard: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();

  // Si no está autenticado, mostrar mensaje de login
  if (!isAuthenticated) {
    return (
      <main>
        <h1>Panel de Control</h1>
        <p>Inicia sesión para ver tus datos y emociones detectadas.</p>
      </main>
    );
  }

  // Si está autenticado pero user todavía null (por alguna razón)
  if (!user) {
    return (
      <main>
        <h1>Panel de Control</h1>
        <p>Cargando información de usuario…</p>
      </main>
    );
  }

  // Usuario autenticado y cargado correctamente
  return (
    <main className="container py-4">
      <h1>Panel de Control</h1>
      <p>
        Bienvenido <strong>{user.email}</strong>, aquí tienes el resumen de
        actividad y análisis recientes.
      </p>

      {/* 📊 Gráfico de distribución de emociones */}
      <EmotionDistributionChart />

      {/* 🔓 Logout */}
      <div className="mt-4">
        <button type="button" className="btn btn-danger" onClick={logout}>
          Cerrar sesión
        </button>
      </div>
    </main>
  );
};

export default Dashboard;
