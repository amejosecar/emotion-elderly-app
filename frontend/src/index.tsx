// # C:\americo\ia_dema\z-proyeto_final\emotion-elderly-app\frontend\src\index.tsx
// # index.tsx
// src/index.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./contexts/AuthContext";
import "./index.css"; // tus estilos globales

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
