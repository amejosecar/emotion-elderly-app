//frontend/src/components/Dashboard/EmotionDistributionChart.tsx
import React, { useEffect, useState } from "react";
import { Bar, Pie, Doughnut, Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  RadialLinearScale,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import api from "../../api/axios";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  RadialLinearScale,
  ArcElement,
  Tooltip,
  Legend
);

interface Emotion {
  label: string;
  confidence: number;
}

interface AnalysisResult {
  audio_id: number;
  emotions: Emotion[];
}

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

const EmotionDistributionChart: React.FC = () => {
  const [emotionCounts, setEmotionCounts] = useState<Record<string, number>>(
    {}
  );
  const [chartType, setChartType] = useState<
    "bar" | "pie" | "doughnut" | "radar"
  >("bar");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get<AnalysisResult[]>("/analyze/results/all");
        const allEmotions: string[] = [];

        res.data.forEach((result) => {
          result.emotions.forEach((emotion) => {
            if (emotion.label) {
              allEmotions.push(emotion.label);
            }
          });
        });

        const countMap: Record<string, number> = {};
        allEmotions.forEach((label) => {
          countMap[label] = (countMap[label] || 0) + 1;
        });

        setEmotionCounts(countMap);
      } catch (err) {
        console.error("Error al obtener emociones:", err);
      }
    };

    fetchData();
  }, []);

  const total = Object.values(emotionCounts).reduce((acc, val) => acc + val, 0);

  const data = {
    labels: Object.keys(emotionCounts),
    datasets: [
      {
        label: "Distribución de emociones (%)",
        data: Object.values(emotionCounts).map((count) =>
          parseFloat(((count / total) * 100).toFixed(2))
        ),
        backgroundColor: Object.keys(emotionCounts).map(
          (label) => emotionColors[label] || "#ccc"
        ),
        borderColor: "#fff",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: chartType !== "bar" },
      tooltip: {
        callbacks: {
          label: (ctx: any) => `${ctx.parsed || ctx.raw}%`,
        },
      },
    },
    scales:
      chartType === "bar"
        ? {
            y: {
              beginAtZero: true,
              title: { display: true, text: "Porcentaje (%)" },
            },
            x: {
              title: { display: true, text: "Emociones" },
            },
          }
        : undefined,
  };

  const renderChart = () => {
    const chartStyle = {
      height: "400px",
      width: "100%",
      maxWidth: "700px",
      margin: "0 auto",
    };

    switch (chartType) {
      case "pie":
        return (
          <div style={chartStyle}>
            <Pie data={data} options={options} />
          </div>
        );
      case "doughnut":
        return (
          <div style={chartStyle}>
            <Doughnut data={data} options={options} />
          </div>
        );
      case "radar":
        return (
          <div style={chartStyle}>
            <Radar data={data} options={options} />
          </div>
        );
      default:
        return (
          <div style={chartStyle}>
            <Bar data={data} options={options} />
          </div>
        );
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h4>📊 Distribución de emociones detectadas</h4>
      <div style={{ marginBottom: "1rem" }}>
        <button onClick={() => setChartType("bar")}>Gráfico de Barras</button>
        <button onClick={() => setChartType("pie")}>Gráfico de Pie</button>
        <button onClick={() => setChartType("doughnut")}>
          Gráfico Doughnut
        </button>
        <button onClick={() => setChartType("radar")}>Gráfico Radar</button>
      </div>
      {renderChart()}
    </div>
  );
};

export default EmotionDistributionChart;
