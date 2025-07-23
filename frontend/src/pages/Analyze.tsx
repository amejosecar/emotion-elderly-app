//C:\americo\ia_dema\z-proyeto_final\emotion-elderly-app\frontend\src\pages\Analyze.tsx
//Analyze.tsx

import React, { useEffect, useState } from "react";
import api from "../api/axios";
import EmotionChart from "../components/EmotionChart";
import "../styles/spinner.css";

type Emotion = {
  id: number;
  label: string;
  confidence: number;
  timestamp: string;
};

type Alert = {
  id: number;
  message: string;
  created_at: string;
};

const Analyze: React.FC = () => {
  const [result, setResult] = useState<{
    emotions: Emotion[];
    alerts: Alert[];
  } | null>(null);
  const [status, setStatus] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      api
        .get("/analyze")
        .then((res) => {
          console.log("🔍 Resultado del análisis:", res.data);
          setResult({ emotions: res.data.emotions, alerts: res.data.alerts });
          setLoading(false);
        })
        .catch(() => {
          setStatus("❌ Error al obtener análisis");
          setLoading(false);
        });
    }, 500); // medio segundo para mostrar el spinner
  }, []);

  return (
    <main>
      <h1>Resultados del Análisis</h1>
      {status && <p>{status}</p>}

      {loading ? (
        <div style={{ textAlign: "center", marginTop: "2rem" }}>
          <div className="spinner" />
          <p>⏳ Analizando emociones, por favor espera…</p>
        </div>
      ) : result ? (
        <>
          {result.emotions.length > 0 ? (
            <EmotionChart
              emotions={result.emotions}
              audioId={result.emotions[0]?.id || 0}
            />
          ) : (
            <p>⚠️ No se detectaron emociones en este audio.</p>
          )}

          <h2 style={{ marginTop: "2rem" }}>🚨 Alertas</h2>
          {result.alerts.length === 0 ? (
            <p>Sin alertas generadas.</p>
          ) : (
            <ul>
              {result.alerts.map((a) => (
                <li key={a.id}>
                  {a.message}{" "}
                  <em>({new Date(a.created_at).toLocaleString()})</em>
                </li>
              ))}
            </ul>
          )}
        </>
      ) : (
        <p>No hay resultados disponibles.</p>
      )}
    </main>
  );
};

export default Analyze;
