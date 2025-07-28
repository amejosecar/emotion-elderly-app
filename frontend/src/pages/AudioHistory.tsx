// # C:\americo\ia_dema\z-proyeto_final\emotion-elderly-app\frontend\src\pages\AudioHistory.tsx
// # AudioHistory.tsx

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Spinner from "react-bootstrap/Spinner";

type Audio = {
  id: number;
  file_path: string;
  created_at: string;
};

type Emotion = {
  id: number;
  audio_id: number;
};

const AudioHistory: React.FC = () => {
  const navigate = useNavigate();
  const [audios, setAudios] = useState<Audio[]>([]);
  const [emotions, setEmotions] = useState<Emotion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAudios = async () => {
      try {
        const [audioRes, emotionRes] = await Promise.all([
          api.get("/audios"),
          api.get("/analyze/emotions"),
        ]);

        setAudios(audioRes.data);
        setEmotions(emotionRes.data);
      } catch (err) {
        console.error("Error al cargar audios o emociones", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAudios();
  }, []);

  const isAnalyzed = (audioId: number) =>
    emotions.some((e) => e.audio_id === audioId);

  // Nuevo: dispara el análisis POST y luego navega
  const handleAnalyze = async (id: number) => {
    setLoading(true);
    try {
      await api.post(`/analyze/?audio_id=${id}`);
      navigate(`/analyze/${id}`);
    } catch (err) {
      console.error("Error al iniciar análisis:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleView = (id: number) => {
    navigate(`/analyze/${id}`);
  };

  const audiosNoAnalizados = audios.filter((a) => !isAnalyzed(a.id));
  const audiosAnalizados = audios.filter((a) => isAnalyzed(a.id));

  return (
    <Container style={{ marginTop: "2rem" }}>
      <h2 className="mb-4">🎧 Audios no analizados</h2>
      {loading ? (
        <Spinner animation="border" />
      ) : audiosNoAnalizados.length === 0 ? (
        <p>No hay audios pendientes de análisis.</p>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Archivo</th>
              <th>Fecha</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {audiosNoAnalizados.map((audio) => (
              <tr key={audio.id}>
                <td>{audio.id}</td>
                <td>{audio.file_path.split("/").pop()}</td>
                <td>{new Date(audio.created_at).toLocaleString()}</td>
                <td>
                  <Button
                    variant="success"
                    onClick={() => handleAnalyze(audio.id)}
                    disabled={loading}
                  >
                    Analizar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <h2 className="mt-5 mb-4">📊 Audios analizados</h2>
      {loading ? (
        <Spinner animation="border" />
      ) : audiosAnalizados.length === 0 ? (
        <p>No hay audios analizados aún.</p>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Archivo</th>
              <th>Fecha</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {audiosAnalizados.map((audio) => (
              <tr key={audio.id}>
                <td>{audio.id}</td>
                <td>{audio.file_path.split("/").pop()}</td>
                <td>{new Date(audio.created_at).toLocaleString()}</td>
                <td>
                  <Button variant="info" onClick={() => handleView(audio.id)}>
                    Ver gráfica
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default AudioHistory;
