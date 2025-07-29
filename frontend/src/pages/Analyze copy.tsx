//C:\americo\ia_dema\z-proyeto_final\emotion-elderly-app\frontend\src\pages\Analyze.tsx
//Analyze.tsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import EmotionChart from "../components/EmotionChart";
import "../styles/spinner.css";
import "../styles/progress.css";

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
  const { audioId } = useParams();
  const [result, setResult] = useState<{
    emotions: Emotion[];
    alerts: Alert[];
  } | null>(null);
  const [status, setStatus] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    setLoading(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => (prev < 90 ? prev + 10 : prev));
    }, 200);

    api
      .get(`/analyze/?audio_id=${audioId}`)
      .then((res) => {
        setResult({ emotions: res.data.emotions, alerts: res.data.alerts });
        setLoading(false);
        setProgress(100);
        clearInterval(interval);
      })
      .catch(() => {
        setStatus("❌ Error al obtener análisis");
        setLoading(false);
        clearInterval(interval);
      });

    return () => clearInterval(interval);
  }, [audioId]);

  return (
    <main>
      <h1>Resultados del Análisis</h1>
      {status && <p>{status}</p>}

      {loading ? (
        <div style={{ textAlign: "center", marginTop: "2rem" }}>
          <div className="spinner" style={{ marginBottom: "1rem" }} />
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <p>⏳ Procesando análisis, por favor espera…</p>
        </div>
      ) : result ? (
        <>
          <EmotionChart emotions={result.emotions} audioId={Number(audioId)} />

          <h2 style={{ marginTop: "2rem" }}>🚨 Alertas</h2>
          {result.alerts.length > 0 ? (
            <ul>
              {result.alerts.map((a) => (
                <li key={a.id}>
                  {a.message}{" "}
                  <em>({new Date(a.created_at).toLocaleString()})</em>
                </li>
              ))}
            </ul>
          ) : (
            <p>Sin alertas generadas.</p>
          )}
        </>
      ) : (
        <p>No hay resultados disponibles.</p>
      )}
    </main>
  );
};

export default Analyze;
