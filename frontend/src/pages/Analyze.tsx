import React, { useEffect, useState } from 'react';
import api from '../api/axios';

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
  const [result, setResult] = useState<{ emotions: Emotion[]; alerts: Alert[] } | null>(null);
  const [status, setStatus] = useState<string>('');

  useEffect(() => {
    api.get('/analyze') // ⚠️ Esto debe ajustarse si necesitas pasar audio_id por props o URL
      .then(res => setResult({ emotions: res.data.emotions, alerts: res.data.alerts }))
      .catch(() => setStatus('❌ Error al obtener análisis'));
  }, []);

  return (
    <main>
      <h1>Resultados del Análisis</h1>
      {status && <p>{status}</p>}

      {result ? (
        <>
          <h2>Emociones Detectadas</h2>
          <table>
            <thead>
              <tr>
                <th>Etiqueta</th>
                <th>Confianza</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {result.emotions.map(e => (
                <tr key={e.id}>
                  <td>{e.label}</td>
                  <td>{(e.confidence * 100).toFixed(1)}%</td>
                  <td>{new Date(e.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h2 style={{ marginTop: '2rem' }}>🚨 Alertas</h2>
          {result.alerts.length === 0 ? (
            <p>Sin alertas generadas.</p>
          ) : (
            <ul>
              {result.alerts.map(a => (
                <li key={a.id}>
                  {a.message} <em>({new Date(a.created_at).toLocaleString()})</em>
                </li>
              ))}
            </ul>
          )}
        </>
      ) : (
        <p>Cargando datos...</p>
      )}
    </main>
  );
};

export default Analyze;

// # C:\americo\ia_dema\z-proyeto_final\emotion-elderly-app\frontend\src\pages\Analyze.tsx
// # Analyze.tsx