// # C:\americo\ia_dema\z-proyeto_final\emotion-elderly-app\frontend\src\pages\AudioHistory.tsx
// # AudioHistory.tsx
import React, { useEffect, useState, useRef } from "react";
import api from "../api/axios";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Spinner from "react-bootstrap/Spinner";
import ProgressBar from "react-bootstrap/ProgressBar";
import type { Audio, AnalysisResult } from "../types";

interface JobInfo {
  jobId: string;
  progress: number;
}

const AudioHistory: React.FC = () => {
  const [audios, setAudios] = useState<Audio[]>([]);
  const [results, setResults] = useState<AnalysisResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState<Record<number, JobInfo>>({});
  const polling = useRef<Record<string, NodeJS.Timer>>({});

  // 🔄 Refrescar resultados desde el backend
  const refreshResults = async () => {
    try {
      const rr = await api.get<AnalysisResult[]>("/analyze/results/all");
      setResults(rr.data);
    } catch (e) {
      console.error("Error al refrescar resultados:", e);
    }
  };

  // Fetch inicial de audios y resultados
  useEffect(() => {
    (async () => {
      try {
        const [ar, rr] = await Promise.all([
          api.get<Audio[]>("/audios"),
          api.get<AnalysisResult[]>("/analyze/results/all"),
        ]);
        setAudios(ar.data);
        setResults(rr.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const isAnalyzed = (id: number) => results.some((r) => r.audio_id === id);

  // Iniciar job y arrancar polling
  const handleAnalyze = async (audio: Audio) => {
    setLoading(true);
    try {
      const res = await api.post<{ job_id: string }>("/analyze/start", null, {
        params: { audio_id: audio.id },
      });
      const jobId = res.data.job_id;
      setJobs((j) => ({ ...j, [audio.id]: { jobId, progress: 0 } }));

      const timer = setInterval(async () => {
        const st = await api.get<{
          status: string;
          progress: number;
          audio_id: number;
        }>("/analyze/status", { params: { job_id: jobId } });
        setJobs((j) => ({
          ...j,
          [audio.id]: { jobId, progress: st.data.progress },
        }));

        if (st.data.status === "done" || st.data.status === "error") {
          clearInterval(polling.current[jobId]);
          delete polling.current[jobId];

          await refreshResults();

          setJobs((j) => {
            const c = { ...j };
            delete c[audio.id];
            return c;
          });
        }
      }, 500);

      polling.current[jobId] = timer;
    } catch (err) {
      console.error("Error iniciando job:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container style={{ marginTop: "2rem" }}>
      <h2>🎧 Audios no analizados</h2>
      {loading ? (
        <Spinner />
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Archivo</th>
              <th>Fecha</th>
              <th>Acción/Progreso</th>
            </tr>
          </thead>
          <tbody>
            {audios
              .filter((a) => !isAnalyzed(a.id))
              .map((a) => {
                const job = jobs[a.id];
                return (
                  <tr key={a.id}>
                    <td>{a.id}</td>
                    <td>{a.file_path.split("/").pop()}</td>
                    <td>{new Date(a.created_at).toLocaleString()}</td>
                    <td style={{ minWidth: 200 }}>
                      {!job ? (
                        <Button
                          variant="success"
                          onClick={() => handleAnalyze(a)}
                          disabled={loading}
                        >
                          Analizar
                        </Button>
                      ) : (
                        <ProgressBar
                          animated
                          now={job.progress}
                          label={`${job.progress}%`}
                        />
                      )}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </Table>
      )}

      <h2 className="mt-5">📊 Audios analizados</h2>
      {loading ? (
        <Spinner />
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Archivo</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {audios
              .filter((a) => isAnalyzed(a.id))
              .map((a) => (
                <tr key={a.id}>
                  <td>{a.id}</td>
                  <td>{a.file_path.split("/").pop()}</td>
                  <td>{new Date(a.created_at).toLocaleString()}</td>
                </tr>
              ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default AudioHistory;
