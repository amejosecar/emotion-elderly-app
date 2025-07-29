//C:\americo\ia_dema\z-proyeto_final\emotion-elderly-app\frontend\src\App.tsx
// frontend/src/App.tsx

import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Auth from "./pages/Auth";
import Loading from "./pages/Loading";

import Dashboard from "./pages/Dashboard";
import AudioHistory from "./pages/AudioHistory";
import Alerts from "./pages/Alerts";
import Analyze from "./pages/Analyze";
import UploadAudio from "./pages/UploadAudio";
import UploadMultipleAudios from "./pages/UploadMultipleAudios"; // ✅ nuevo componente

import PrivateRoute from "./components/PrivateRoute";
import Layout from "./components/layout/Layout";

const App: React.FC = () => (
  <Routes>
    {/* 🌐 Rutas públicas */}
    <Route path="/" element={<Navigate to="/login" replace />} />
    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<Auth mode="signup" />} />
    <Route path="/loading" element={<Loading />} />

    {/* 🔐 Rutas privadas */}
    <Route element={<PrivateRoute />}>
      <Route element={<Layout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/audios" element={<AudioHistory />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/analyze" element={<Analyze />} />
        <Route path="/analyze/:audioId" element={<Analyze />} />
        <Route path="/upload" element={<UploadAudio />} />
        <Route
          path="/upload-multiple"
          element={<UploadMultipleAudios />}
        />{" "}
        {/* ✅ nueva ruta */}
      </Route>
    </Route>

    {/* 🧭 Catch-all */}
    <Route path="*" element={<Navigate to="/login" replace />} />
  </Routes>
);

export default App;
