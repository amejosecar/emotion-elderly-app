// src/pages/Login.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // FastAPI OAuth2PasswordRequestForm espera form-urlencoded
      const form = new URLSearchParams();
      form.append("username", email);
      form.append("password", password);

      const res = await api.post("/auth/login", form, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      // Si tu backend devuelve { access_token }
      const token = res.data.access_token;
      login(token);
      navigate("/dashboard");
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 422 && Array.isArray(err.response.data)) {
          // validación de Pydantic, convierte a texto
          const msgs = err.response.data.map(
            (v: any) => `${v.loc.join(".")}: ${v.msg}`
          );
          setError(msgs.join(" • "));
        } else {
          // error estándar con detalle
          setError(
            (err.response?.data as any)?.detail || "Error al iniciar sesión"
          );
        }
      } else {
        setError("Error al iniciar sesión");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h1>Iniciar Sesión</h1>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        <label>
          Contraseña
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? "Cargando…" : "Entrar"}
        </button>
      </form>
    </div>
  );
};

export default Login;
