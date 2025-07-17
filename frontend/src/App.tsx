//  C:\americo\ia_dema\z-proyeto_final\emotion-elderly-app\frontend\src\App.tsx
// frontend/src/App.tsx


import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import AudioHistory from "./pages/AudioHistory";
import Alerts from "./pages/Alerts";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Auth mode="login" />} />
        <Route path="/signup" element={<Auth mode="signup" />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/audios" element={<AudioHistory />} />
        <Route path="/alerts" element={<Alerts />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
