// # C:\americo\ia_dema\z-proyeto_final\emotion-elderly-app\frontend\src\pages\Auth.tsx
// # Auth.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../api/axios';

type Props = { mode: 'login' | 'signup' };

const Auth: React.FC<Props> = ({ mode }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (mode === 'signup') {
        await api.post('/auth/signup', { email, password });
        // Después de registrarse, redirige a login
        navigate('/login');
      } else {
        const form = new FormData();
        form.append('username', email);
        form.append('password', password);

        const res = await api.post('/auth/login', form);
        login(res.data.access_token);
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Error inesperado');
    }
  };

  return (
    <main>
      <h1>{mode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <button type="submit">
          {mode === 'login' ? 'Entrar' : 'Registrarse'}
        </button>
      </form>
    </main>
  );
};

export default Auth;
