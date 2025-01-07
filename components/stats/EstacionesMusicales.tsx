"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Sun, Snowflake, Flower, Leaf } from "lucide-react";

// Colores e íconos para cada estación
const COLORS = ["#1dafb9", "#1ed760", "#ffa600", "#ff6b00"];
const SEASONS = ["Invierno", "Primavera", "Verano", "Otoño"];
// eslint-disable-next-line react/jsx-key
const ICONS = [<Snowflake />, <Flower />, <Sun />, <Leaf />];

const SEASON_KEYS_MAP: Record<string, string> = {
  invierno: "invierno",
  primavera: "primavera",
  verano: "verano",
  otoño: "otono", // Mapea "otoño" a "otono"
};

interface StationData {
  artist: { name: string; artistPicUrl: string };
  genre: { name: string };
}

interface StationsResponse {
  invierno: StationData;
  primavera: StationData;
  verano: StationData;
  otono: StationData;
}

const DonutChart = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [data, setData] = useState<StationsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStationsData = async () => {
      try {
        const response = await fetch("/api/stats/estaciones-musicales", {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch station data");
        }

        const result: StationsResponse = await response.json();

        console.log("Fetched season data:", result);

        setData(result);
      } catch (error) {
        console.error("Error fetching station data:", error);
        setError("Failed to load station data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchStationsData();
  }, []);

  // Update mouse position on movement
  const handleMouseMove = (event: React.MouseEvent) => {
    setMousePosition({ x: event.clientX, y: event.clientY });
  };

  useEffect(() => {
    console.log("Hovered Index:", hoveredIndex);
    console.log("Mouse Position:", mousePosition);
  }, [hoveredIndex, mousePosition]);

  const radius = 100; // Radio del gráfico
  const innerRadius = 60; // Radio interno del "donut"
  const expandedRadius = 130; // Radio cuando el segmento está resaltado
  const rotationOffset = -135; // Girar el gráfico

  const calculatePath = (startAngle: number, endAngle: number, isHovered: boolean) => {
    const r = isHovered ? expandedRadius : radius;

    const x1 = r * Math.cos((startAngle * Math.PI) / 180);
    const y1 = r * Math.sin((startAngle * Math.PI) / 180);
    const x2 = r * Math.cos((endAngle * Math.PI) / 180);
    const y2 = r * Math.sin((endAngle * Math.PI) / 180);

    const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;

    return `
      M ${x1} ${y1}
      A ${r} ${r} 0 ${largeArcFlag} 1 ${x2} ${y2}
      L ${innerRadius * Math.cos((endAngle * Math.PI) / 180)} ${innerRadius * Math.sin((endAngle * Math.PI) / 180)}
      A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${
        innerRadius * Math.cos((startAngle * Math.PI) / 180)
      } ${innerRadius * Math.sin((startAngle * Math.PI) / 180)}
      Z
    `;
  };

  const segments = SEASONS.map((season, index) => {
    const startAngle = rotationOffset + (index * 360) / SEASONS.length;
    const endAngle = rotationOffset + ((index + 1) * 360) / SEASONS.length;
    const isHovered = index === hoveredIndex;

    return (
      <path
        key={index}
        d={calculatePath(startAngle, endAngle, isHovered)}
        fill={COLORS[index]}
        stroke='#fff'
        strokeWidth='2'
        onMouseEnter={() => setHoveredIndex(index)}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoveredIndex(null)}
        style={{
          transition: "d 0.2s ease-in-out",
        }}
      />
    );
  });

  if (loading) return <div>Cargando...</div>;
  if (error || !data) return <div>{error || "Error al cargar los datos"}</div>;

  if (hoveredIndex !== null) {
    const seasonKey = SEASON_KEYS_MAP[SEASONS[hoveredIndex]?.toLowerCase()] as keyof StationsResponse;
    console.log("Hovered index:", hoveredIndex);
    console.log("Season key:", seasonKey);
    console.log("Artist data for season:", data?.[seasonKey]?.artist);
  }

  return (
    <div
      className='relative w-full h-[400px] flex items-center justify-center'
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect(); // Obtener posición del contenedor
        const x = e.clientX - rect.left; // Coordenadas relativas
        const y = e.clientY - rect.top; // Coordenadas relativas
        console.log("Mouse Position (relative):", { x, y });
        setMousePosition({ x, y });
      }}
    >
      {/* Gráfico circular */}
      <svg
        width='300'
        height='300'
        viewBox='-150 -150 300 300'
        style={{
          overflow: "visible",
        }}
      >
        {segments}

        {/* Mostrar el ícono centrado si hay un segmento seleccionado */}
        {hoveredIndex !== null && (
          <g transform='translate(0, 0)'>
            <foreignObject x='-30' y='-30' width='60' height='60'>
              <div
                className='flex items-center justify-center w-full h-full text-center'
                style={{
                  transform: "scale(1.5)",
                  color: COLORS[hoveredIndex],
                }}
              >
                {ICONS[hoveredIndex]}
              </div>
            </foreignObject>
          </g>
        )}
      </svg>

      {/* Tarjeta flotante */}
      <div
        className='absolute bg-black text-white p-4 rounded-md shadow-lg'
        style={{
          top: `${mousePosition.y - 20}px`, // Positivo: abajo, Negativo: arriba
          left: `${mousePosition.x - 150}px`, // Positivo: derecha, Negativo: izquierda
          zIndex: 50,
          transform: "translate(-50%, -50%)",
        }}
      >
        {hoveredIndex !== null ? (
          <>
            <div className='flex items-center mb-2'>
              <Image
                src={
                  data[SEASON_KEYS_MAP[SEASONS[hoveredIndex]?.toLowerCase()] as keyof StationsResponse].artist
                    .artistPicUrl
                }
                alt='Artista'
                width={48} // Define un tamaño fijo en píxeles
                height={48} // Define un tamaño fijo en píxeles
                className='w-12 h-12 rounded-full mr-2'
              />
              <div>
                <h3 className='text-lg font-bold'>
                  {data[SEASON_KEYS_MAP[SEASONS[hoveredIndex]?.toLowerCase()] as keyof StationsResponse].artist.name}
                </h3>
                <p className='text-gray-400 text-sm'>
                  Género:{" "}
                  {data[SEASON_KEYS_MAP[SEASONS[hoveredIndex]?.toLowerCase()] as keyof StationsResponse].genre.name}
                </p>
              </div>
            </div>
          </>
        ) : (
          <p>No hay datos disponibles</p>
        )}
      </div>
    </div>
  );
};

export default DonutChart;
