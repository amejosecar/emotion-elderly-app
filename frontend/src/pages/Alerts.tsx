// frontend/src/pages/Alerts.tsx
import React, { useState, useEffect } from "react";
import api from "../api/axios";
import type { Audio, AnalysisResult } from "../types";

const Alerts: React.FC = () => {
  const [audios, setAudios] = useState<Audio[]>([]);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    api
      .get<Audio[]>("/audios")
      .then((res) => setAudios(res.data))
      .catch(() => setError("No se pudieron cargar los audios"));
  }, []);

  const handleAnalyze = async (audioId: number) => {
    setError("");
    setLoading(true);
    setAnalysis(null);

    try {
      const res = await api.get<AnalysisResult>(`/analyze?audio_id=${audioId}`);
      setAnalysis(res.data);
    } catch {
      setError("Error al obtener el análisis");
    } finally {
      setLoading(false);
    }
  };

  const renderReport = () => {
    if (!analysis) return null;

    const top4 = [...analysis.emotions]
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 4);

    const alto = top4.filter((e) => e.confidence >= 0.12);
    const medio = top4.filter(
      (e) => e.confidence >= 0.1 && e.confidence < 0.12
    );
    const bajo = top4.filter((e) => e.confidence >= 0.05 && e.confidence < 0.1);

    const ts = analysis.alerts[0]?.created_at ?? new Date().toISOString();
    const audioId = analysis.audio_id ?? "—";

    return (
      <div style={{ marginTop: 20, padding: 16, border: "1px solid #ccc" }}>
        <h2>Alerta para el asistente del adulto mayor</h2>
        <p>
          <strong>Momento de detección:</strong> {new Date(ts).toLocaleString()}
        </p>
        <p>
          <strong>ID del audio:</strong> {audioId}
        </p>

        <h3>1. Resumen de emociones críticas</h3>
        <ul>
          {top4.map((e) => (
            <li key={e.id}>
              {e.label} ({e.confidence.toFixed(2)})
            </li>
          ))}
        </ul>

        <h3>2. Nivel de urgencia</h3>
        <p>
          <strong>Alto (≥ 0.12):</strong>{" "}
          {alto.map((e) => e.label).join(", ") || "—"}
        </p>
        <p>
          <strong>Medio (0.10–0.12):</strong>{" "}
          {medio.map((e) => e.label).join(", ") || "—"}
        </p>
        <p>
          <strong>Bajo (0.05–0.10):</strong>{" "}
          {bajo.map((e) => e.label).join(", ") || "—"}
        </p>

        <p>
          La combinación de{" "}
          {alto.length > 0
            ? "emociones en alto nivel"
            : "emociones moderadas/bajas"}{" "}
          requiere acción inmediata.
        </p>
      </div>
    );
  };

  return (
    <div style={{ padding: 24 }}>
      <h1>🚨 Alertas</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <ul>
        {audios.map((a) => (
          <li key={a.id} style={{ marginBottom: 8 }}>
            <span>{new Date(a.created_at).toLocaleString()}</span>
            <button
              style={{ marginLeft: 12 }}
              onClick={() => handleAnalyze(a.id)}
            >
              Análisis
            </button>
          </li>
        ))}
      </ul>

      {loading && <p>Cargando análisis…</p>}
      {renderReport()}
    </div>
  );
};

export default Alerts;
