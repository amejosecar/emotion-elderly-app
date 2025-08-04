//C:\americo\ia_dema\z-proyeto_final\emotion-elderly-app\frontend\src\components\SummaryCharts.tsx

import React, { useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import api from "../api/axios";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
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

const SummaryCharts: React.FC = () => {
  const [labels, setLabels] = useState<string[]>([]);
  const [freqData, setFreqData] = useState<number[]>([]);
  const [critPerc, setCritPerc] = useState<number[]>([]);

  useEffect(() => {
    (async () => {
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
        setFreqData(emotionLabels.map((lab) => freqMap[lab]));
        setCritPerc(critPercents);
      } catch (error) {
        console.error("Error al cargar los datos:", error);
      }
    })();
  }, []);

  // 🎯 Gráfico de barras con frecuencia y criticidad
  const barData = {
    labels,
    datasets: [
      {
        label: "Frecuencia",
        data: freqData,
        backgroundColor: "rgba(90, 93, 255, 0.7)",
      },
      {
        label: "Criticidad (%)",
        data: critPerc,
        backgroundColor: "rgba(255, 183, 3, 0.7)",
      },
    ],
  };

  // 🥧 Gráfico circular de criticidad
  const pieData = {
    labels,
    datasets: [
      {
        data: critPerc,
        backgroundColor: [
          "#E63946",
          "#F4A261",
          "#2A9D8F",
          "#E9C46A",
          "#457B9D",
          "#1D3557",
          "#A8DADC",
          "#FFB703",
        ].slice(0, labels.length),
      },
    ],
  };

  return (
    <section>
      <h2>📊 Resumen Global de Emociones</h2>
      <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 300, height: 300 }}>
          <Bar
            data={barData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: "top",
                },
              },
            }}
          />
        </div>
        <div style={{ flex: 1, minWidth: 300, height: 300 }}>
          <Pie
            data={pieData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: "right",
                },
              },
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default SummaryCharts;
