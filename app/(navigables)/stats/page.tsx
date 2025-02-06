"use client";

import { useState } from "react";
import StatsGrid from "@/components/StatsGrid";
import StatWrapper from "@/components/StatWrapper";

// Define the type for a single stat item
type StatItem = {
  id: string;
  title: string;
  iconName: keyof typeof import("lucide-react");
  className?: string;
};

// Define the stats array with the correct types
const stats: StatItem[] = [
  {
    id: "hall-of-fame",
    title: "Hall of Fame",
    iconName: "Award",
    className: "md:col-span-2 lg:col-span-2 lg:row-span-2",
  },
  { id: "tus-decadas", title: "Tus Décadas", iconName: "Rewind", className: "md:col-span-1 lg:col-span-2" },
  {
    id: "huella-del-dia",
    title: "Huella Del Día",
    iconName: "Fingerprint",
  },
  { id: "estaciones-musicales", title: "Estaciones Musicales", iconName: "SunSnow" },

  {
    id: "la-bitacora",
    title: "La Bitácora",
    iconName: "BookMarked",
    className: "md:col-span-2 lg:col-span-2",
  },
  { id: "indice-de-interferencia", title: "Índice de Interferencia", iconName: "AudioWaveform" },
];

export default function Stats() {
  const [activeStat, setActiveStat] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleStatClick = (statId: string) => {
    setActiveStat(statId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setActiveStat(null);
    setIsModalOpen(false);
  };

  return (
    <main className='bg-spotify-black min-h-screen'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        <h1 className='text-4xl md:text-5xl font-bold mb-12 text-center bg-gradient-to-r from-spotify-green to-spotify-blue bg-clip-text text-transparent'>
          Estadísticas Avanzadas
        </h1>
        <StatsGrid stats={stats} onStatClick={handleStatClick} />
      </div>
      <StatWrapper activeStat={activeStat} isOpen={isModalOpen} onClose={handleCloseModal} />
    </main>
  );
}
