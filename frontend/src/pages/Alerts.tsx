// src/pages/Alerts.tsx
import React, { useState, useEffect, useCallback } from "react";
import {
  Row,
  Col,
  Button,
  Spinner,
  Alert as BSAlert,
  Card,
  Table,
} from "react-bootstrap";
import api from "../api/axios";
import type { Audio, AnalysisResult } from "../types";
import EmotionChart from "../components/EmotionChart";

const Alerts: React.FC = () => {
  const [audios, setAudios] = useState<Audio[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string>("");
  const [selectedAudio, setSelectedAudio] = useState<number | null>(null);
  const [viewType, setViewType] = useState<"alert" | "chart">("alert");
  const [results, setResults] = useState<Record<number, AnalysisResult>>({});
  const [jobs, setJobs] = useState<Record<number, string>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  const paginatedAudios = audios.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(audios.length / itemsPerPage);

  useEffect(() => {
    (async () => {
      setLoadingList(true);
      try {
        const [audiosRes, resultsRes] = await Promise.all([
          api.get<Audio[]>("/audios"),
          api.get<AnalysisResult[]>("/analyze/results/all"),
        ]);
        const analyzedIds = new Set(resultsRes.data.map((r) => r.audio_id));
        const filteredAudios = audiosRes.data.filter((a) =>
          analyzedIds.has(a.id)
        );
        setAudios(filteredAudios);

        const resultMap: Record<number, AnalysisResult> = {};
        resultsRes.data.forEach((r) => {
          resultMap[r.audio_id] = r;
        });
        setResults(resultMap);

        const jobStatuses: Record<number, string> = {};
        await Promise.all(
          filteredAudios.map(async (audio) => {
            try {
              const res = await api.get("/analyze/status/by-audio", {
                params: { audio_id: audio.id },
              });
              jobStatuses[audio.id] = res.data.status;
            } catch {
              jobStatuses[audio.id] = "unknown";
            }
          })
        );
        setJobs(jobStatuses);
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar los audios.");
      } finally {
        setLoadingList(false);
      }
    })();
  }, []);

  const fetchAnalysis = useCallback(
    async (audioId: number, mode: "alert" | "chart") => {
      setError("");
      setLoadingAnalysis(true);
      setSelectedAudio(audioId);
      setViewType(mode);
      setAnalysis(null);

      try {
        const res = await api.get<AnalysisResult>("/analyze/by-audio", {
          params: { audio_id: audioId },
        });
        setAnalysis(res.data);
      } catch (err) {
        console.error(err);
        setError("Error al obtener el análisis.");
      } finally {
        setLoadingAnalysis(false);
      }
    },
    []
  );

  const renderAlertReport = () => {
    if (!analysis) return null;

    const { audio_id, emotions, alerts } = analysis;
    if (!emotions || emotions.length === 0) {
      return (
        <BSAlert variant="warning">
          ⚠️ No se detectaron emociones en este audio.
        </BSAlert>
      );
    }

    const top4 = [...emotions]
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 4);

    const alto = top4.filter((e) => e.confidence >= 0.12);
    const medio = top4.filter(
      (e) => e.confidence >= 0.1 && e.confidence < 0.12
    );
    const bajo = top4.filter((e) => e.confidence >= 0.05 && e.confidence < 0.1);
    const ts = alerts?.length ? alerts[0].created_at : new Date().toISOString();

    return (
      <Card className="p-3">
        <Card.Title>Alerta para el asistente</Card.Title>
        <Card.Text>
          <strong>Audio #:</strong> {audio_id} <br />
          <strong>Detección:</strong> {new Date(ts).toLocaleString()}
        </Card.Text>

        <h5>1. Emociones críticas</h5>
        <ul>
          {top4.map((e) => (
            <li key={e.id}>
              {e.label}: {(e.confidence * 100).toFixed(1)}%
            </li>
          ))}
        </ul>

        <h5>2. Nivel de urgencia</h5>
        <p>
          <strong>Alto (≥12%):</strong>{" "}
          {alto.map((e) => e.label).join(", ") || "—"}
        </p>
        <p>
          <strong>Medio (10–12%):</strong>{" "}
          {medio.map((e) => e.label).join(", ") || "—"}
        </p>
        <p>
          <strong>Bajo (5–10%):</strong>{" "}
          {bajo.map((e) => e.label).join(", ") || "—"}
        </p>

        <p className="mt-3">
          {alto.length
            ? "⚠️ Acción inmediata recomendada"
            : "ℹ️ Monitoreo continuo"}
        </p>
      </Card>
    );
  };

  return (
    <div className="container-fluid py-4">
      <h2>🚨 Alertas</h2>
      {error && <BSAlert variant="danger">{error}</BSAlert>}

      <Row>
        {/* Tabla de audios */}
        <Col md={6} className="pe-2">
          {loadingList ? (
            <Spinner animation="border" />
          ) : (
            <>
              <Table striped bordered hover responsive className="mb-3">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Archivo</th>
                    <th>Fecha</th>
                    <th>Ver alerta</th>
                    <th>Ver gráfico</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedAudios.map((a) => {
                    const status = jobs[a.id];
                    const hasResult = results[a.id] !== undefined;
                    const isPending =
                      status === "pending" || status === "running";
                    const isError = status === "error";

                    return (
                      <tr
                        key={a.id}
                        className={
                          a.id === selectedAudio ? "table-primary" : ""
                        }
                      >
                        <td>{a.id}</td>
                        <td>{a.file_path}</td>
                        <td>{new Date(a.created_at).toLocaleString()}</td>
                        <td>
                          <Button
                            size="sm"
                            variant="primary"
                            onClick={() => fetchAnalysis(a.id, "alert")}
                            disabled={!hasResult || isError}
                          >
                            Ver alerta
                          </Button>
                          {isPending && (
                            <span className="ms-2 text-warning">
                              ⏳{" "}
                              {status === "pending" ? "En cola" : "Procesando"}
                            </span>
                          )}
                          {isError && (
                            <span className="ms-2 text-danger">
                              ❌ Error en análisis
                            </span>
                          )}
                        </td>
                        <td>
                          <Button
                            size="sm"
                            variant="info"
                            onClick={() => fetchAnalysis(a.id, "chart")}
                            disabled={!hasResult || isError}
                          >
                            Ver gráfico
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>

              {/* Paginación */}
              <div className="d-flex justify-content-between">
                <Button
                  size="sm"
                  variant="outline-secondary"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                >
                  ⬅ Anterior
                </Button>
                <span>
                  Página {currentPage} de {totalPages}
                </span>
                <Button
                  size="sm"
                  variant="outline-secondary"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                >
                  Siguiente ➡
                </Button>
              </div>
            </>
          )}
        </Col>

        {/* Análisis a la derecha */}
        <Col md={6} className="ps-2">
          {loadingAnalysis && (
            <div className="text-center">
              <Spinner animation="border" />
            </div>
          )}

          {!loadingAnalysis &&
            analysis &&
            viewType === "alert" &&
            renderAlertReport()}

          {!loadingAnalysis &&
            analysis &&
            viewType === "chart" &&
            analysis.emotions.length > 0 && (
              <EmotionChart
                emotions={analysis.emotions}
                audioId={analysis.audio_id}
              />
            )}
        </Col>
      </Row>
    </div>
  );
};

export default Alerts;
