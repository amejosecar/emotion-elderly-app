// src/pages/Loading.tsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Loading: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/dashboard");
    }, 1000); // espera 1 segundo

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <main style={{ textAlign: "center", marginTop: "3rem" }}>
      <h1>🔄 Cargando tu panel…</h1>
      <p>Estamos preparando tus datos, por favor espera.</p>
    </main>
  );
};

export default Loading;
