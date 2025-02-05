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
import NoFavorites from "@/components/NoFavorites";
import Loading from "@/components/Loading";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface AggregatedData {
  [key: string]: number; // Ejemplo: {"2020": 150, "2021": 120}, {"2020-01": 15}, etc.
}

type TimeData = {
  [key: string]: number;
};

const timeScales = ["año", "mes", "día"];

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

      console.log("Fetching URL:", url);

      const response = await fetch(url, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`Error fetching data: ${response.statusText}`);
      }

      const newData: AggregatedData = await response.json();

      console.log("Fetched data:", newData);

      setData(newData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatLabels = (key: string) => {
    if (currentScale === 1) {
      // Nivel de mes: mostrar el nombre del mes
      const monthNames = [
        "enero",
        "febrero",
        "marzo",
        "abril",
        "mayo",
        "junio",
        "julio",
        "agosto",
        "septiembre",
        "octubre",
        "noviembre",
        "diciembre",
      ];
      const [, month] = key.split("-");
      return monthNames[parseInt(month, 10) - 1];
    } else if (currentScale === 2) {
      // Nivel de día: mostrar solo el número del día
      const [, , day] = key.split("-");
      return parseInt(day, 10).toString(); // Remueve ceros iniciales
    }
    return key; // Nivel de año: no cambiar nada
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

  const capitalizeFirstLetter = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

  const sortedKeys = Object.keys(data).sort((a, b) => {
    // Ordena según el formato (año, año-mes, año-mes-día)
    return a.localeCompare(b, undefined, { numeric: true });
  });

  const sortedValues = sortedKeys.map((key) => data[key]);

  const chartData = {
    labels: sortedKeys,
    datasets: [
      {
        label: "Canciones Guardadas",
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
        text: (() => {
          if (currentScale === 0) {
            return "Canciones Guardadas por Año";
          } else if (currentScale === 1) {
            const year = history[0];
            return `Canciones Guardadas en el Año ${year}`;
          } else if (currentScale === 2) {
            const [year, fullMonth] = history;
            const month = fullMonth.split("-")[1];

            console.log("Dentro del title text => Month:", month);

            const monthNames = [
              "enero",
              "febrero",
              "marzo",
              "abril",
              "mayo",
              "junio",
              "julio",
              "agosto",
              "septiembre",
              "octubre",
              "noviembre",
              "diciembre",
            ];
            const monthName =
              month && parseInt(month, 10) >= 1 && parseInt(month, 10) <= 12
                ? monthNames[parseInt(month, 10) - 1]
                : "mes desconocido";
            return `Canciones Guardadas en ${capitalizeFirstLetter(monthName)} de ${year}`;
          }
        })(),
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
          callback: (value: unknown, index: number) => formatLabels(sortedKeys[index]), // Formatea los labels
        },
        grid: {
          display: false,
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
    <>
      {isLoading ? (
        <Loading />
      ) : Object.keys(data).length === 0 ? ( // 🔹 Comprueba si data está vacío
        <NoFavorites />
      ) : (
        <div className='w-full h-full flex flex-col bg-spotify-gray-300 p-6 rounded-lg'>
          {currentScale > 0 && (
            <button
              onClick={handleBack}
              className='flex items-center text-spotify-green hover:underline transition-colors duration-200'
            >
              <ArrowLeft className='mr-2' size={20} />
              Volver a {capitalizeFirstLetter(timeScales[currentScale - 1])}
            </button>
          )}
          <div className='flex-grow h-[400px]'>
            <Bar data={chartData} options={options} />
          </div>
          <div className='mt-4 text-center text-white text-sm'>Haz clic en una barra para ver más detalles</div>
        </div>
      )}
    </>
  );
}
