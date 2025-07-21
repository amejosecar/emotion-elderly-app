// 📄 src/pages/Dashboard.tsx

import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <main>
      <h1>Panel de Control</h1>

      {user && (
        <p>
          Bienvenido <strong>{user.email}</strong>, aquí tienes el resumen de actividad y análisis recientes.
        </p>
      )}

      {!user && (
        <p>Inicia sesión para ver tus datos y emociones detectadas.</p>
      )}
    </main>
  );
};

export default Dashboard;


// # C:\americo\ia_dema\z-proyeto_final\emotion-elderly-app\frontend\src\pages\Dashboard.tsx
// # Dashboard.tsx
