"use client";

import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import { ActiveElement, ChartEvent } from "chart.js/auto";

type HuellaDelDiaData = { [hour: string]: number };

const HuellaDelDia = () => {
  const [data, setData] = useState<HuellaDelDiaData | null>(null);
  const [hoveredHour, setHoveredHour] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/stats/huella-del-dia");
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error al cargar los datos:", error);
      }
    };
    fetchData();
  }, []);

  if (!data) {
    return (
      <div className='flex justify-center items-center h-64 text-white'>
        <p>Cargando datos...</p>
      </div>
    );
  }

  const labels = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, "0")}:00`);
  const values = labels.map((hour) => data[hour] || 0);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Minutos escuchados",
        data: values,
        borderColor: "#1DB954",
        backgroundColor: "rgba(29, 185, 84, 0.2)",
        borderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 6,
        pointBackgroundColor: "#1DB954",
        tension: 0.4, // Líneas suavizadas
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        callbacks: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          label: (context: any) => `${context.raw} minutos`,
        },
      },
    },
    onHover: (event: ChartEvent, elements: ActiveElement[]) => {
      if (elements.length > 0) {
        const hoveredIndex = elements[0].index;
        setHoveredHour(labels[hoveredIndex]);
      } else {
        setHoveredHour(null);
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Horas del día",
          color: "#FFFFFF",
        },
        ticks: {
          color: "#FFFFFF",
        },
      },
      y: {
        title: {
          display: true,
          text: "Minutos escuchados",
          color: "#FFFFFF",
        },
        ticks: {
          stepSize: 10,
          color: "#FFFFFF",
        },
        beginAtZero: true,
        max: 60,
      },
    },
  };

  return (
    <div className='bg-black text-white rounded-md p-4 shadow-md'>
      <h2 className='text-2xl font-bold mb-4'>Huella del Día</h2>
      <div className='relative h-96'>
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default HuellaDelDia;
