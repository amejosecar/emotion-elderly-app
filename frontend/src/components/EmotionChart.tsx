// frontend/src/components/EmotionChart.tsx
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
  Tristeza: "#5DADE2",
  Alegría: "#FFD700",
  Miedo: "#4B0082",
  Enojo: "#E63946",
  Desagrado: "#9ACD32",
  Sorpresa: "#FFA500",
  Neutral: "#95A5A6",
  Confianza: "#008080",
  Vergüenza: "#8E44AD",
  Culpa: "#8B4513",
  Amor: "#E91E63",
  Orgullo: "#FFB400",
  Interés: "#1ABC9C",
  Calma: "#AED6F1",
  Confusión: "#7F8C8D",
  Ansiedad: "#34495E",
};

type Props = {
  emotions: Emotion[];
  audioId: number;
};

const EmotionChart: React.FC<Props> = ({ emotions, audioId }) => {
  if (!emotions.length) {
    return <p>⚠️ No se detectaron emociones en este audio.</p>;
  }

  const valid = emotions.filter(
    (e) => typeof e.label === "string" && typeof e.confidence === "number"
  );
  if (!valid.length) {
    return <p>⚠️ Los datos de emociones están incompletos o corruptos.</p>;
  }

  const data = {
    labels: valid.map((e) => e.label),
    datasets: [
      {
        label: "Confianza (%)",
        data: valid.map((e) => e.confidence * 100),
        backgroundColor: valid.map((e) => emotionColors[e.label] || "#ccc"),
        datalabels: {
          anchor: "end",
          align: "top",
          formatter: (v: number) => `${v.toFixed(1)}%`,
          color: "#333",
          font: { weight: "bold" },
        },
      },
    ],
  };

  const options = {
    plugins: { legend: { display: false }, datalabels: { display: true } },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: { callback: (v: number) => `${v}%` },
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <section>
      <h2>🎭 Emociones detectadas en el audio #{audioId}</h2>

      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: "2rem",
          marginTop: "1rem",
        }}
      >
        {/* Gráfico a la izquierda */}
        <div style={{ flex: 1, minWidth: "300px", height: "300px" }}>
          <Bar data={data} options={options} />
        </div>

        {/* Leyenda a la derecha */}
        <aside style={{ minWidth: "160px" }}>
          <h3>🎨 Leyenda</h3>
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
                <span
                  style={{
                    display: "inline-block",
                    width: 16,
                    height: 16,
                    backgroundColor: color,
                    borderRadius: 4,
                    marginRight: 8,
                  }}
                />
                {label}
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </section>
  );
};

export default EmotionChart;
