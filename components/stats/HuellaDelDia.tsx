"use client";

import { Line } from "react-chartjs-2";
import { Chart as ChartJS, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend } from "chart.js";
import { useEffect, useState } from "react";

// Registra los componentes de Chart.js
ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend);

export default function HuellaDelDia() {
  const [data, setData] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    let isAborted = false; // Bandera para evitar actualizaciones de estado tras un aborto

    const fetchHuellaDelDia = async () => {
      console.log("=== INICIO DE FETCH, setLoading(true) ===");
      setLoading(true); // Establece el estado de carga
      setData([]); // Resetea los datos previos

      try {
        const response = await fetch("/api/stats/huella-del-dia", { signal });

        if (!response.ok) {
          throw new Error("Failed to fetch Huella Del Día data");
        }

        const result = await response.json();

        if (!isAborted) {
          if (result.error) {
            setError(result.error);
          } else {
            setData(result);
          }
        }
      } catch (error) {
        if ((error as Error).name === "AbortError") {
          console.log("=== FETCH ABORTADO ===");
          isAborted = true; // Se marca como abortado
          return;
        }
        console.error("Error fetching Huella Del Día data:", error);
        if (!isAborted) {
          setError("Failed to load Huella Del Día data. Please try again later.");
        }
      } finally {
        if (!isAborted) {
          console.log("=== FIN DE FETCH, setLoading(false) ===");
          setLoading(false); // Solo actualiza el estado si no fue abortado
        }
      }
    };

    fetchHuellaDelDia();

    return () => {
      console.log("=== ABORTANDO FETCH ===");
      isAborted = true; // Evita actualizaciones de estado tras el desmontaje
      controller.abort(); // Aborta la solicitud pendiente
    };
  }, []);

  if (loading) {
    return <div>Loading...</div>;
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
