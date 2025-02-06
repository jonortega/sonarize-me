"use client";

import { useState } from "react";
import { Stage, Layer, Image, Text } from "react-konva";
import useImage from "use-image";
import { useFetch } from "@/lib/useFetch";

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
  const [isZoomed, setIsZoomed] = useState(false);

  const ALBUM_SIZE = 50;
  const PADDING = ALBUM_SIZE / 6;

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error al cargar los datos: {error.toString()}</div>;

  const years = tracksByYear
    ? Object.keys(tracksByYear)
        .map((year) => Number(year))
        .sort((a, b) => a - b)
    : [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleWheel = (e: any) => {
    e.evt.preventDefault();

    const scaleBy = 1.1;
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

  const handleClick = () => {
    setIsZoomed(!isZoomed);
    setScale(isZoomed ? 1 : 3);
    setPosition({ x: 0, y: 0 });
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
          onClick={handleClick}
          style={{
            cursor: isZoomed ? "zoom-out" : "zoom-in",
          }}
        >
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
          {/* Eje X */}
          <Layer>
            {years.map((year, index) => (
              <Text
                key={year}
                text={year.toString()}
                x={index * ALBUM_SIZE + PADDING}
                y={ALBUM_SIZE * 12 + 10}
                fontSize={14}
                fill='white'
              />
            ))}
          </Layer>
        </Stage>
      </div>
    </div>
  );
}
