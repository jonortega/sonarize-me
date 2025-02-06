"use client";

import { useState } from "react";
import { Stage, Layer, Image, Text, Line } from "react-konva";
import useImage from "use-image";
import { useFetch } from "@/lib/useFetch";
import React from "react";

export interface TrackData {
  id: string;
  albumPicUrl: string;
  year: number;
}

type TracksByYear = {
  [year: number]: TrackData[];
};

// Componente para cargar y renderizar cada imagen
const AlbumCover = ({ url, x, y, size }: { url: string; x: number; y: number; size: number }) => {
  const [image] = useImage(url, "anonymous");
  return <Image image={image} x={x} y={y} width={size} height={size} alt='' />;
};

export default function TusDecadas() {
  const { data: tracksByYear, loading, error } = useFetch<TracksByYear>("/api/stats/tus-decadas");

  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [cursorStyle, setCursorStyle] = useState("grab");

  const ALBUM_SIZE = 50;

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error al cargar los datos: {error.toString()}</div>;

  // Obtener los años ordenados
  const years = tracksByYear
    ? Object.keys(tracksByYear)
        .map((year) => Number(year))
        .sort((a, b) => a - b)
    : [];

  // **NUEVO**: Calcular las décadas y sus posiciones
  const decades = years.reduce((acc: { decade: number; startIndex: number }[], year, index) => {
    const decade = Math.floor(year / 10) * 10; // Redondear hacia la década más cercana
    if (!acc.find((d) => d.decade === decade)) {
      acc.push({ decade, startIndex: index }); // Almacenar la década y su índice de inicio
    }
    return acc;
  }, []);

  // Evento para hacer zoom con la rueda del ratón
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleWheel = (e: any) => {
    e.evt.preventDefault();

    const scaleBy = 1.2;
    const stage = e.target.getStage();
    if (!stage) return;

    const oldScale = stage.scaleX();
    const mousePointTo = {
      x: stage.getPointerPosition()!.x / oldScale - stage.x() / oldScale,
      y: stage.getPointerPosition()!.y / oldScale - stage.y() / oldScale,
    };

    const newScale = e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;

    setScale(newScale);

    const newPos = {
      x: -(mousePointTo.x - stage.getPointerPosition()!.x / newScale) * newScale,
      y: -(mousePointTo.y - stage.getPointerPosition()!.y / newScale) * newScale,
    };

    setPosition(newPos);
  };

  return (
    <div className='w-full bg-[#121212] p-6 rounded-lg shadow-lg'>
      <div className='relative bg-[#181818] rounded-lg overflow-hidden'>
        <Stage
          width={800}
          height={600}
          draggable
          scaleX={scale}
          scaleY={scale}
          x={position.x}
          y={position.y}
          onWheel={handleWheel}
          onMouseDown={() => setCursorStyle("grabbing")} // Cambia a "grabbing"
          onMouseUp={() => setCursorStyle("grab")} // Vuelve a "grab"
          onMouseLeave={() => setCursorStyle("grab")} // Asegúrate de que el cursor vuelva a "grab" al salir
          style={{
            cursor: cursorStyle, // Usa el estado del cursor
          }}
        >
          {/* Capa para las portadas de álbumes */}
          <Layer>
            {tracksByYear &&
              years.map((year, yearIndex) => {
                const tracks = tracksByYear[year] || [];
                return tracks.map((track, trackIndex) => (
                  <AlbumCover
                    key={track.id}
                    url={track.albumPicUrl}
                    x={yearIndex * ALBUM_SIZE} // Calcula la posición en el eje X
                    y={600 - (trackIndex + 1) * ALBUM_SIZE} // Calcula desde abajo hacia arriba
                    size={ALBUM_SIZE}
                  />
                ));
              })}
          </Layer>
          {/* Capa para los labels de décadas y marcas divisorias */}
          <Layer>
            {decades.map(({ decade, startIndex }) => {
              const labelX = startIndex * ALBUM_SIZE + (ALBUM_SIZE * 10) / 2; // Centrar en la década
              const lineX = startIndex * ALBUM_SIZE; // Línea divisoria al inicio de la década

              return (
                <React.Fragment key={decade}>
                  {/* Label de la década */}
                  <Text
                    text={decade.toString()}
                    x={labelX - 55}
                    y={ALBUM_SIZE * 12 + 25} // Ajustar debajo de las portadas
                    fontSize={50}
                    fill='white'
                    align='center'
                    textAlign='center'
                  />
                  {/* Marca divisoria */}
                  <Line
                    points={[lineX, ALBUM_SIZE * 12, lineX, ALBUM_SIZE * 12 + 50]} // Desde la base hacia abajo
                    stroke='white'
                    strokeWidth={2}
                  />
                </React.Fragment>
              );
            })}

            {/* Línea adicional al final */}
            <Line
              points={[
                years.length * ALBUM_SIZE, // Posición al final de las columnas
                ALBUM_SIZE * 12, // Base de las portadas
                years.length * ALBUM_SIZE, // Misma posición X
                ALBUM_SIZE * 12 + 50, // Extensión hacia abajo
              ]}
              stroke='white'
              strokeWidth={2}
            />

            {/* Línea de base */}
            <Line
              points={[0, ALBUM_SIZE * 12 + 1, years.length * ALBUM_SIZE, ALBUM_SIZE * 12 + 1]} // De un extremo al otro
              stroke='white'
              strokeWidth={2}
            />
          </Layer>
        </Stage>
      </div>
    </div>
  );
}
