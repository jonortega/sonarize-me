"use client";

import { Line } from "react-chartjs-2";
import { Chart as ChartJS, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend } from "chart.js";
import Loading from "@/components/Loading";
import { useFetch } from "@/lib/useFetch";

// Registra los componentes de Chart.js
ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend);

export default function HuellaDelDia() {
  const { data, loading, error } = useFetch<number[]>("/api/stats/huella-del-dia");

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  const labels = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, "0")}:00`);

  return (
    <div>
      <Line
        data={{
          labels,
          datasets: [
            {
              label: "Minutos Escuchados",
              data, // Datos desde el backend
              backgroundColor: "rgba(30, 215, 96, 0.2)",
              borderColor: "rgba(30, 215, 96, 1)",
              borderWidth: 2,
              tension: 0.4, // Suavidad de las líneas
              fill: false,
              pointStyle: false,
            },
          ],
        }}
        options={{
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              max: 60, // Máximo de minutos por hora
              title: {
                display: true,
                text: "Minutos",
                color: "#FFFFFF",
              },
              grid: {
                display: true, // Eliminar grid del eje y
                color: "#121212",
              },
              ticks: {
                color: "#FFFFFF", // Contraste para los ticks del eje y
              },
            },
            x: {
              title: {
                display: true,
                text: "Horas del Día",
                color: "#FFFFFF",
              },
              grid: {
                display: false, // Eliminar grid del eje x
              },
              ticks: {
                color: "#FFFFFF", // Contraste para los ticks del eje x
              },
            },
          },
          plugins: {
            legend: {
              display: true,
              position: "top",
              labels: {
                color: "#FFFFFF", // Contraste para el texto de la leyenda
              },
            },
          },
        }}
      />
    </div>
  );
}
