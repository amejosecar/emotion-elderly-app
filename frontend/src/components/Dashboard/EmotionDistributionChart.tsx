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

// Pesos para calcular criticidad
const WEIGHTS: Record<string, number> = {
  Confusión: 3,
  Miedo: 3,
  Tristeza: 3,
  Enojo: 2,
  Alegría: 1,
  Serenidad: 1,
};

// Colores base para emociones
const emotionColors: string[] = [
  "#E63946",
  "#F4A261",
  "#2A9D8F",
  "#E9C46A",
  "#457B9D",
  "#1D3557",
  "#A8DADC",
  "#FFB703",
  "#5DADE2",
  "#8E44AD",
  "#34495E",
  "#E91E63",
];

const EmotionDistributionChart: React.FC = () => {
  const [labels, setLabels] = useState<string[]>([]);
  const [critPerc, setCritPerc] = useState<number[]>([]);
  const [chartType, setChartType] = useState<
    "bar" | "pie" | "doughnut" | "radar"
  >("radar");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/analyze/results/all");
        const allEmotions = res.data.flatMap((r: any) =>
          r.emotions.map((e: any) => e.label)
        );

        // Frecuencia
        const freqMap: Record<string, number> = {};
        allEmotions.forEach((lab: string) => {
          freqMap[lab] = (freqMap[lab] || 0) + 1;
        });
        const emotionLabels = Object.keys(freqMap);

        // Criticidad
        const impacts = emotionLabels.map(
          (lab) => (freqMap[lab] || 0) * (WEIGHTS[lab] || 1)
        );
        const totalImpact = impacts.reduce((a, b) => a + b, 0);
        const critPercents = impacts.map((imp) =>
          totalImpact ? parseFloat(((imp / totalImpact) * 100).toFixed(2)) : 0
        );

        setLabels(emotionLabels);
        setCritPerc(critPercents);
      } catch (err) {
        console.error("Error al obtener emociones:", err);
      }
    };

    fetchData();
  }, []);

  const data = {
    labels,
    datasets: [
      {
        label: "Criticidad (%)",
        data: critPerc,
        backgroundColor:
          chartType === "radar"
            ? "rgba(255, 183, 3, 0.3)"
            : emotionColors.slice(0, labels.length),
        borderColor: chartType === "radar" ? "rgba(255, 183, 3, 0.8)" : "#fff",
        pointBackgroundColor: "rgba(255, 183, 3, 1)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgba(255, 183, 3, 1)",
        borderWidth: 2,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: chartType !== "bar",
        position: "top",
        labels: {
          color: "#333",
          font: {
            size: 14,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: (ctx: any) => `${ctx.parsed || ctx.raw}%`,
        },
      },
    },
    scales:
      chartType === "radar"
        ? {
            r: {
              beginAtZero: true,
              max: 100,
              ticks: {
                callback: (value: number) => `${value}%`,
                stepSize: 20,
                color: "#666",
                font: {
                  size: 12,
                },
              },
              grid: {
                color: "rgba(0,0,0,0.1)",
              },
              angleLines: {
                color: "rgba(0,0,0,0.2)",
              },
              pointLabels: {
                color: "#444",
                font: {
                  size: 13,
                  weight: "bold",
                },
              },
            },
          }
        : chartType === "bar"
        ? {
            y: {
              beginAtZero: true,
              title: { display: true, text: "Criticidad (%)" },
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
      <h4>📊 Distribución de criticidad emocional</h4>
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
