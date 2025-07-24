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
  Alegría: "#F7DC6F",
  Miedo: "#A569BD",
  Enojo: "#E74C3C",
  Desagrado: "#58D68D",
};

type Props = {
  emotions: Emotion[];
  audioId: number;
};

const EmotionChart: React.FC<Props> = ({ emotions, audioId }) => {
  console.log("🎨 Emotions recibidas en EmotionChart:", emotions);

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
  };

  return (
    <section>
      <h2>🎭 Emociones detectadas en el audio #{audioId}</h2>
      <Bar data={data} options={options} />

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
