"use client";

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

type TimeData = {
  [key: string]: number;
};

const timeScales = ["year", "month", "day"];

export default function LaBitacora() {
  const [data, setData] = useState<TimeData>({});
  const [currentScale, setCurrentScale] = useState(0);
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async (year?: string, month?: string) => {
    let url = "/api/stats/la-bitacora";
    if (year) {
      url += `?year=${year}`;
      if (month) url += `&month=${month}`;
    }

    const response = await fetch(url);
    const newData: TimeData = await response.json();
    setData(newData);
  };

  const handleBarClick = (event: ChartEvent, elements: ActiveElement[]) => {
    if (elements.length > 0) {
      const index = elements[0].index;
      const selectedPeriod = Object.keys(data)[index];

      if (currentScale < timeScales.length - 1) {
        setHistory([...history, selectedPeriod]);
        setCurrentScale(currentScale + 1);
        fetchData(...history, selectedPeriod);
      }
    }
  };

  const handleBack = () => {
    if (currentScale > 0) {
      const newHistory = [...history];
      newHistory.pop();
      setHistory(newHistory);
      setCurrentScale(currentScale - 1);
      fetchData(...newHistory);
    }
  };

  const sortedKeys = Object.keys(data).sort((a, b) => parseInt(a) - parseInt(b));
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
      <div className='flex justify-between items-center mb-6'>
        {currentScale > 0 && (
          <button
            onClick={handleBack}
            className='flex items-center text-spotify-green hover:underline transition-colors duration-200'
          >
            <ArrowLeft className='mr-2' size={20} />
            Back to {timeScales[currentScale - 1]}s
          </button>
        )}
      </div>
      <div className='flex-grow h-[400px]'>
        <Bar data={chartData} options={options} />
      </div>
      <div className='mt-4 text-center text-white text-sm'>Click on a bar to see more details</div>
    </div>
  );
}
