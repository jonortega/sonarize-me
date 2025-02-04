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

  // Encuentra la hora del día con más escuchas
  const maxMinutes = data ? Math.max(...data) : 0;
  const maxIndex = data ? data.indexOf(maxMinutes) : 0;
  const maxHour = labels[maxIndex];

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
              pointStyle: "line",
            },
            {
              // Añade un punto destacado en la hora con más escuchas
              label: "Pico de Escuchas",
              data: data ? data.map((value, index) => (index === maxIndex ? value : null)) : [], // Solo muestra el punto en la hora máxima
              backgroundColor: "rgba(255, 79, 140, 1)", // Color del punto destacado
              borderColor: "rgba(255, 79, 140, 1)", // Color del borde
              pointRadius: 8, // Tamaño del punto
              pointHoverRadius: 14, // Tamaño del punto al pasar el ratón
              borderWidth: 2,
              pointStyle: "circle",
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
                display: true, // Mostrar grid del eje y
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
                usePointStyle: true,
              },
            },
          },
        }}
      />

      {/* Texto descriptivo */}
      <p className='text-center mt-4 text-lg text-white'>
        El momento del día que más música escuchas es a las{" "}
        <span className='font-bold text-spotify-green drop-shadow-[0_4px_6px_rgba(30,215,96,0.3)]'>{maxHour}</span>.
      </p>
    </div>
  );
}
