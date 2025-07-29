// frontend/src/components/EmotionChart.tsx
import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  ChartDataLabels
);

type Emotion = {
  label: string;
  confidence: number;
};

const emotionColors: Record<string, string> = {
  Tristeza: "#2A4F72", // azul oscuro para tristeza
  Alegría: "#FFD700", // amarillo brillante para alegría
  Miedo: "#4B0082", // índigo (morado oscuro) para miedo
  Enojo: "#E63946", // rojo intenso para ira
  Desagrado: "#9ACD32", // verde oliva para desagrado
  Sorpresa: "#FFA500", // naranja vivo para sorpresa
  Neutral: "#95A5A6", // gris medio para neutralidad
  Confianza: "#008080", // verde azulado (teal) para confianza
  Vergüenza: "#8E44AD", // magenta profundo para vergüenza
  Culpa: "#8B4513", // marrón oscuro para culpa
  Amor: "#E91E63", // rosa para amor
  Orgullo: "#FFB400", // dorado para orgullo
  Interés: "#1ABC9C", // turquesa para interés
  Calma: "#AED6F1", // azul pastel para calma
  Confusión: "#7F8C8D", // gris azulado apagado para confusión
  Ansiedad: "#34495E", // carbón oscuro para ansiedad
};

type Props = {
  emotions: Emotion[];
  audioId: number;
};

const EmotionChart: React.FC<Props> = ({ emotions, audioId }) => {
  if (!emotions || emotions.length === 0) {
    return <p>⚠️ No se detectaron emociones en este audio.</p>;
  }

  const validEmotions = emotions.filter(
    (e) => typeof e.label === "string" && typeof e.confidence === "number"
  );

  if (validEmotions.length === 0) {
    return <p>⚠️ Los datos de emociones están incompletos o corruptos.</p>;
  }

  const data = {
    labels: validEmotions.map((e) => e.label),
    datasets: [
      {
        label: "Confianza (%)",
        data: validEmotions.map((e) => e.confidence * 100),
        backgroundColor: validEmotions.map(
          (e) => emotionColors[e.label] || "#ccc"
        ),
        datalabels: {
          anchor: "end",
          align: "top",
          formatter: (value: number) => `${value.toFixed(1)}%`,
          color: "#333",
          font: {
            weight: "bold",
          },
        },
      },
    ],
  };

  const options = {
    plugins: {
      legend: { display: false },
      datalabels: {
        display: true,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: (value: number) => `${value}%`,
        },
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <section>
      <h2>🎭 Emociones detectadas en el audio #{audioId}</h2>
      <div style={{ maxWidth: "600px", margin: "0 auto", height: "300px" }}>
        <Bar data={data} options={options} />
      </div>

      <div style={{ marginTop: "1rem" }}>
        <h3>🎨 Leyenda de emociones</h3>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {Object.entries(emotionColors).map(([label, color]) => (
            <li
              key={label}
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "4px",
              }}
            >
              <div
                style={{
                  width: "16px",
                  height: "16px",
                  backgroundColor: color,
                  marginRight: "8px",
                  borderRadius: "4px",
                }}
              />
              {label}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default EmotionChart;
