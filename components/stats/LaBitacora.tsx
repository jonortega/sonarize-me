"use client";

/**
 * ! Los datos enviados desde el servidor son solo los que tienen algo.
 * ! Hay que corregir para que se envien los años, meses y días que no tienen datos (value=0).
 *
 * ! También hay que eliminar el periodo de carga entre clicks en las barras.
 * ! Si se elimina, es mucho más fluida la interacción.
 */

import { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartEvent,
  ActiveElement,
} from "chart.js";
import { ArrowLeft } from "lucide-react";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface AggregatedData {
  [key: string]: number; // Ejemplo: {"2020": 150, "2021": 120}, {"2020-01": 15}, etc.
}

type TimeData = {
  [key: string]: number;
};

const timeScales = ["year", "month", "day"];

export default function LaBitacora() {
  const [data, setData] = useState<TimeData>({});
  const [currentScale, setCurrentScale] = useState(0);
  const [history, setHistory] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async (year?: string, month?: string) => {
    setIsLoading(true);
    try {
      let url = "/api/stats/la-bitacora";
      if (year) {
        url += `?year=${year}`;
        if (month) url += `&month=${month}`;
      }

      console.log("Fetching URL:", url); // Confirma que los parámetros year y month son correctos

      const response = await fetch(url, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`Error fetching data: ${response.statusText}`);
      }

      const newData: AggregatedData = await response.json();

      console.log("Fetched data:", newData);

      setData(newData); // Actualiza el estado con los datos procesados
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBarClick = (event: ChartEvent, elements: ActiveElement[]) => {
    if (elements.length > 0) {
      const index = elements[0].index;
      const selectedPeriod = sortedKeys[index]; // Obtiene el periodo seleccionado (año, mes, día)

      if (currentScale < timeScales.length - 1) {
        const newHistory = [...history, selectedPeriod];
        setHistory(newHistory); // Añade el periodo actual al historial
        setCurrentScale(currentScale + 1); // Incrementa el nivel del gráfico

        // Construir los parámetros correctamente según el nivel
        let year = newHistory[0];
        let month;

        if (currentScale === 1) {
          // Extrae solo el mes si estamos en el nivel de meses
          const [y, m] = selectedPeriod.split("-");
          year = y;
          month = m; // Aquí aseguramos que solo pase el mes
        }

        fetchData(year, month);
      }
    }
  };

  const handleBack = () => {
    if (currentScale > 0) {
      const newHistory = [...history];
      newHistory.pop(); // Quita el último elemento del historial
      setHistory(newHistory);
      setCurrentScale(currentScale - 1); // Reduce el nivel del gráfico

      // Llama a fetchData con los parámetros adecuados
      const [year, month] = newHistory;
      fetchData(year, month);
    }
  };

  const sortedKeys = Object.keys(data).sort((a, b) => {
    // Ordena según el formato (año, año-mes, año-mes-día)
    return a.localeCompare(b, undefined, { numeric: true });
  });

  const sortedValues = sortedKeys.map((key) => data[key]);

  const chartData = {
    labels: sortedKeys,
    datasets: [
      {
        label: "Tracks Saved",
        data: sortedValues,
        backgroundColor: "rgba(30, 215, 96, 0.6)",
        borderColor: "rgba(30, 215, 96, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // ???
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: "rgba(255, 255, 255, 0.8)",
          font: {
            size: 14,
          },
        },
      },
      title: {
        display: true,
        text: `Tracks Saved by ${timeScales[currentScale].charAt(0).toUpperCase() + timeScales[currentScale].slice(1)}`,
        color: "rgba(255, 255, 255, 0.9)",
        font: {
          size: 18,
          weight: 700,
        },
      },
      tooltip: {
        callbacks: {
          label: (context: { parsed: { y: number } }) => {
            const value = context.parsed.y;
            const total = Object.values(data).reduce((sum, v) => sum + v, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${value} tracks (${percentage}%)`;
          },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: "rgba(255, 255, 255, 0.8)",
          font: {
            size: 12,
          },
        },
        grid: {
          color: "#121212",
        },
      },
      y: {
        ticks: {
          color: "rgba(255, 255, 255, 0.8)",
          font: {
            size: 12,
          },
        },
        grid: {
          color: "#121212",
        },
      },
    },
    onClick: handleBarClick,
  };

  return (
    <div className='w-full h-full flex flex-col bg-spotify-gray-300 p-6 rounded-lg'>
      {isLoading ? (
        <div className='flex justify-center items-center h-full'>
          <span className='text-white text-lg'>Loading...</span>
        </div>
      ) : (
        <>
          {currentScale > 0 && (
            <button
              onClick={handleBack}
              className='flex items-center text-spotify-green hover:underline transition-colors duration-200'
            >
              <ArrowLeft className='mr-2' size={20} />
              Back to {timeScales[currentScale - 1]}s
            </button>
          )}
          <div className='flex-grow h-[400px]'>
            <Bar data={chartData} options={options} />
          </div>
          <div className='mt-4 text-center text-white text-sm'>Click on a bar to see more details</div>
        </>
      )}
    </div>
  );
}
