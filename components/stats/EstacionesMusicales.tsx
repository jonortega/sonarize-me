"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Sun, Snowflake, Flower, Leaf, AudioLines } from "lucide-react";
import NoFavorites from "@/components/NoFavorites";

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

const EstacionesMusicales = () => {
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

        // Comprobación: Si todos los datos son "vacíos", no hay tracks reales
        const allEmpty = Object.values(result).every(
          (season) => season.artist.name === "Artista desconocido" && season.genre.name === "Sin género"
        );

        if (allEmpty) {
          setError("No hay canciones guardadas en favoritos.");
          return;
        }

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

  if (loading) return <div>Cargando...</div>; // ! Se puede extraer al fallback?
  if (error === "No hay canciones guardadas en favoritos.") return <NoFavorites />;
  if (error || !data) return <div>{error || "Error al cargar los datos"}</div>;

  if (hoveredIndex !== null) {
    const seasonKey = SEASON_KEYS_MAP[SEASONS[hoveredIndex]?.toLowerCase()] as keyof StationsResponse;
    console.log("Hovered index:", hoveredIndex);
    console.log("Season key:", seasonKey);
    console.log("Artist data for season:", data?.[seasonKey]?.artist);
  }

  return (
    <div
      className='relative w-full h-[400px] flex flex-col items-center justify-center'
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect(); // Obtener posición del contenedor
        const x = e.clientX - rect.left; // Coordenadas relativas
        const y = e.clientY - rect.top; // Coordenadas relativas
        console.log("Mouse Position (relative):", { x, y });
        setMousePosition({ x, y });
      }}
      onMouseLeave={() => setHoveredIndex(null)}
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
      {hoveredIndex !== null && (
        <div
          className='absolute bg-black text-white p-4 rounded-lg shadow-lg w-72'
          style={{
            top: `${mousePosition.y - 100}px`, // Positivo: abajo, Negativo: arriba
            left: `${
              hoveredIndex !== null && SEASONS[hoveredIndex].toLowerCase() === "otoño"
                ? mousePosition.x + 170 // Ajustar más hacia la derecha para otoño
                : mousePosition.x - 160 // Posición estándar
            }px`,
            zIndex: 50,
            transform: "translate(-50%, -50%)",
          }}
        >
          {hoveredIndex !== null ? (
            <>
              {/* Título */}
              <h2 className='text-lg font-bold text-center mb-4'>Destacados de {SEASONS[hoveredIndex]}</h2>

              {/* Contenido en horizontal con cuadros separados */}
              <div className='flex justify-between gap-4'>
                {/* Cuadro de Artista */}
                <div className='flex flex-col items-center bg-gray-800 p-4 rounded-md w-1/2'>
                  <Image
                    src={
                      data[SEASON_KEYS_MAP[SEASONS[hoveredIndex]?.toLowerCase()] as keyof StationsResponse].artist
                        .artistPicUrl
                    }
                    alt='Artista'
                    width={60}
                    height={60}
                    className='rounded-full mb-2'
                  />
                  <p className='text-sm font-medium text-center'>
                    {data[SEASON_KEYS_MAP[SEASONS[hoveredIndex]?.toLowerCase()] as keyof StationsResponse].artist.name}
                  </p>
                  <span className='text-xs text-gray-400 mt-1'>Artista</span>
                </div>

                {/* Cuadro de Género */}
                <div className='flex flex-col items-center bg-gray-800 p-4 rounded-md w-1/2'>
                  <div className='flex items-center justify-center w-16 h-16 bg-gray-700 rounded-full mb-2'>
                    <AudioLines className='w-8 h-8 text-white' />
                  </div>
                  <p className='text-sm font-medium text-center'>
                    {data[SEASON_KEYS_MAP[SEASONS[hoveredIndex]?.toLowerCase()] as keyof StationsResponse].genre.name
                      .split(" ")
                      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(" ")}
                  </p>
                  <span className='text-xs text-gray-400 mt-1'>Género</span>
                </div>
              </div>
            </>
          ) : (
            <p>No hay datos disponibles</p>
          )}
        </div>
      )}
    </div>
  );
};

export default EstacionesMusicales;
