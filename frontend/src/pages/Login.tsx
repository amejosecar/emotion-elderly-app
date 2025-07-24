// src/pages/Login.tsx
import React, { useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus("");

    try {
      const formData = new URLSearchParams();
      formData.append("username", username);
      formData.append("password", password);

      const response = await axios.post("/auth/login", formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      console.log("✅ Login exitoso:", response.data);

      const token = response.data.access_token;
      localStorage.setItem("access_token", token);
      setStatus("✅ Autenticación exitosa");

      console.log("🔁 Redirigiendo a /analyze");
      navigate("/loading"); // ✅ redirige a pantalla de carga
    } catch (error: any) {
      console.error("❌ Error en login:", error);
      if (error.response) {
        console.error("🔍 Detalle del error:", error.response.data);
      }
      setStatus("❌ Usuario o contraseña incorrectos");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <h1>🔐 Iniciar sesión</h1>
      <form onSubmit={handleLogin}>
        <div>
          <label>Usuario:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Contraseña:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Cargando..." : "Enviar"}
        </button>
      </form>
      {status && <p>{status}</p>}
    </main>
  );
};

export default Login;
