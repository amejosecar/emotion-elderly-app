import React, { useEffect, useState } from 'react';
import api from '../api/axios';

type Audio = {
  id: number;
  file_path: string;
  created_at: string;
};

const AudioHistory: React.FC = () => {
  const [audios, setAudios] = useState<Audio[]>([]);
  const [status, setStatus] = useState<string>('');

  useEffect(() => {
    api.get('/audios/')
      .then(res => setAudios(res.data))
      .catch(() => setStatus('❌ Error al cargar audios'));
  }, []);

  const handleAnalyze = async (id: number) => {
    setStatus('');
    try {
      const res = await api.post(`/analyze/?audio_id=${id}`);
      setStatus(`✅ Audio ${id} analizado. Emociones detectadas: ${res.data.emotions.length}`);
    } catch (err: any) {
      setStatus(err.response?.data?.detail || '❌ Fallo en análisis');
    }
  };

  return (
    <main>
      <h1>Historial de Audios</h1>
      {status && <p>{status}</p>}

      {audios.length === 0 ? (
        <p>No hay audios subidos aún.</p>
      ) : (
        <ul>
          {audios.map(audio => (
            <li key={audio.id}>
              <strong>ID:</strong> {audio.id} |
              <strong> Subido:</strong> {new Date(audio.created_at).toLocaleString()}
              <button onClick={() => handleAnalyze(audio.id)}>Analizar</button>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
};

export default AudioHistory;



// # C:\americo\ia_dema\z-proyeto_final\emotion-elderly-app\frontend\src\pages\AudioHistory.tsx
// # AudioHistory.tsx
