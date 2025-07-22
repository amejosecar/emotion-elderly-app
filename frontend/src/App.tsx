// src/App.tsx

import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Páginas públicas
import Home from "./pages/Home";
import Login from "./pages/Login";
import Auth from "./pages/Auth"; // tu página de signup
// Páginas privadas
import Dashboard from "./pages/Dashboard";
import AudioHistory from "./pages/AudioHistory";
import Alerts from "./pages/Alerts";
import Analyze from "./pages/Analyze";
import UploadAudio from "./pages/UploadAudio";

import PrivateRoute from "./components/PrivateRoute";
import Layout from "./components/layout/Layout";

const App: React.FC = () => (
  <BrowserRouter>
    <Routes>
      {/* Root público */}
      <Route path="/" element={<Home />} />

      {/* Autenticación pública */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Auth />} />

      {/* Rutas protegidas: primero chequear sesión, luego envolver en Layout */}
      <Route element={<PrivateRoute />}>
        <Route element={<Layout />}>
          {/* Redirige "/" dentro de las privadas a dashboard */}
          <Route index element={<Navigate to="dashboard" replace />} />

          <Route path="dashboard" element={<Dashboard />} />
          <Route path="audios" element={<AudioHistory />} />
          <Route path="alerts" element={<Alerts />} />
          <Route path="analyze" element={<Analyze />} />
          <Route path="upload" element={<UploadAudio />} />

          {/* Wildcard privado */}
          <Route path="*" element={<Navigate to="dashboard" replace />} />
        </Route>
      </Route>

      {/* Cualquier ruta no definida redirige a la home pública */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </BrowserRouter>
);

export default App;
