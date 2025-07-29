// frontend/src/pages/Alerts.tsx
// src/pages/Alerts.tsx
import React, { useState, useEffect, useCallback } from "react";
import {
  Row,
  Col,
  ListGroup,
  Button,
  Spinner,
  Alert as BSAlert,
  Card,
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

  // 1) Carga inicial de audios con análisis disponible
  useEffect(() => {
    (async () => {
      setLoadingList(true);
      try {
        const [audiosRes, resultsRes] = await Promise.all([
          api.get<Audio[]>("/audios"),
          api.get<AnalysisResult[]>("/analyze/results/all"),
        ]);
        const analyzedIds = new Set(resultsRes.data.map((r) => r.audio_id));
        setAudios(audiosRes.data.filter((a) => analyzedIds.has(a.id)));
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar los audios.");
      } finally {
        setLoadingList(false);
      }
    })();
  }, []);

  // 2) Función genérica para traer el análisis y fijar modo de vista
  const fetchAnalysis = useCallback(
    async (audioId: number, mode: "alert" | "chart") => {
      setError("");
      setLoadingAnalysis(true);
      setSelectedAudio(audioId);
      setViewType(mode);
      setAnalysis(null);

      try {
        const res = await api.get<AnalysisResult>(
          `/analyze?audio_id=${audioId}`
        );
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

  // 3) Render del bloque de alerta
  const renderAlertReport = () => {
    if (!analysis) return null;

    const { audio_id, emotions, alerts } = analysis;
    const top4 = [...emotions]
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 4);

    const alto = top4.filter((e) => e.confidence >= 0.12);
    const medio = top4.filter(
      (e) => e.confidence >= 0.1 && e.confidence < 0.12
    );
    const bajo = top4.filter((e) => e.confidence >= 0.05 && e.confidence < 0.1);
    const ts = alerts[0]?.created_at ?? new Date().toISOString();

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
    <div className="container py-4">
      <Row>
        {/* Columna izquierda: lista de audios */}
        <Col md={4}>
          <h2>🚨 Alertas</h2>
          {error && <BSAlert variant="danger">{error}</BSAlert>}

          {loadingList ? (
            <Spinner animation="border" />
          ) : (
            <ListGroup>
              {audios.map((a) => (
                <ListGroup.Item
                  key={a.id}
                  active={a.id === selectedAudio}
                  className="d-flex justify-content-between align-items-center"
                >
                  <small>{new Date(a.created_at).toLocaleString()}</small>
                  <div>
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => fetchAnalysis(a.id, "alert")}
                      className="me-1"
                    >
                      Ver alerta
                    </Button>
                    <Button
                      size="sm"
                      variant="info"
                      onClick={() => fetchAnalysis(a.id, "chart")}
                    >
                      Ver gráfico
                    </Button>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>

        {/* Columna derecha: detalle */}
        <Col md={8}>
          {loadingAnalysis && (
            <div className="text-center">
              <Spinner animation="border" />
            </div>
          )}

          {!loadingAnalysis &&
            analysis &&
            viewType === "alert" &&
            renderAlertReport()}

          {!loadingAnalysis && analysis && viewType === "chart" && (
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
