//src/components/layout/Navbar.tsx
// 📄 src/components/layout/Navbar.tsx

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Navbar.css';

const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav>
      <Link to="/">Inicio</Link>

      {isAuthenticated ? (
        <>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/audios">Audios</Link>
          <Link to="/alerts">Alertas</Link>
          <Link to="/upload">Subir Audio</Link>

          {/* 👤 Info del usuario logueado */}
          {user && (
            <span style={{ marginLeft: 'auto' }}>
              👤 <strong>{user.email}</strong>
            </span>
          )}
          <button onClick={handleLogout}>Cerrar sesión</button>
        </>
      ) : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/signup">Registrarse</Link>
        </>
      )}
    </nav>
  );
};

export default Navbar;
