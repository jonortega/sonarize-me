"use client";

/**
 * ! Hay bugs a la hora de renderizar la cuadrícula de imágenes,
 * ! se superponen las portadas y sobre todo al hacer zoom.
 * ! Puede que la solución sea esperar a que se cargue todo antes de mostrarlo,
 * ! y mantenerlo como una imagen estática.
 *
 * ! El componente hace dos veces petición al backend, porovocando
 * ! que se carguen todos los datos dos veces inncesariamente.
 * ! ¿Por qué hace eso, es de Next.js?
 */

import { useEffect, useRef, useState, useCallback } from "react";

export interface TrackData {
  id: string;
  albumPicUrl: string;
  year: number;
}

export interface DecadeData {
  decade: number;
  tracks: TrackData[];
}

type TracksByYear = {
  [year: number]: TrackData[];
};

interface ImageLoadingQueue {
  x: number;
  y: number;
  size: number;
  url: string;
}

export default function TusDecadas() {
  const [tracks, setTracks] = useState<TrackData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageQueueRef = useRef<ImageLoadingQueue[]>([]);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchTracks = async () => {
      setLoading(true);

      try {
        const response = await fetch("/api/stats/tus-decadas", { signal });
        if (!response.ok) throw new Error("Failed to fetch tracks");
        const data = await response.json();
        setTracks(data);
      } catch (err) {
        if ((err as Error).name === "AbortError") {
          console.log("Petición abortada");
        } else {
          setError(err instanceof Error ? err.message : "An error occurred");
        }
      } finally {
        if (!signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchTracks();

    return () => {
      controller.abort(); // Cancelar la petición al limpiar el efecto
    };
  }, []);

  const drawImage = useCallback((ctx: CanvasRenderingContext2D, url: string, x: number, y: number, size: number) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = url;
    img.onload = () => {
      ctx.drawImage(img, x, y, size, size);
    };
    img.onerror = () => {
      console.error(`Error al cargar la imagen desde ${url}`);
      // Opcional: Puedes dibujar un marcador de error en el canvas
      ctx.fillStyle = "#ff0000";
      ctx.fillRect(x, y, size, size); // Dibuja un cuadrado rojo para indicar el error
    };
  }, []);

  useEffect(() => {
    if (!tracks.length || !canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctxRef.current = ctx;
    imageQueueRef.current = []; // Limpia la cola anterior

    // 1. Agrupar tracks por año
    const tracksByYear: TracksByYear = tracks.reduce((acc: TracksByYear, track: TrackData) => {
      const year = track.year;
      if (!acc[year]) {
        acc[year] = []; // Inicializa el array del año si no existe
      }
      acc[year].push(track); // Añade el track al año correspondiente
      return acc;
    }, {});

    // 2. Crear una lista ordenada de años
    const years = Object.keys(tracksByYear)
      .map((year) => Number(year)) // Convertir las claves (strings) a números
      .sort((a, b) => a - b); // Ordenar los años de menor a mayor

    // 3. Configurar dimensiones del canvas
    const ALBUM_SIZE = 30 * scale;
    const PADDING = 20 * scale;
    const AXIS_PADDING = 80 * scale;
    const YEAR_WIDTH = ALBUM_SIZE; // Ancho de cada columna (1 columna por año)

    const totalWidth = years.length * YEAR_WIDTH + AXIS_PADDING + PADDING;
    const maxTracksInYear = Math.max(...Object.values(tracksByYear).map((tracks) => tracks.length));
    const totalHeight = maxTracksInYear * ALBUM_SIZE + AXIS_PADDING + PADDING * 2;

    canvas.width = totalWidth;
    canvas.height = totalHeight;

    container.style.minWidth = `${canvas.width}px`;

    // 4. Limpiar el canvas
    ctx.fillStyle = "#121212";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 5. Dibujar ejes
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2 * scale;

    // Eje Y
    ctx.beginPath();
    ctx.moveTo(AXIS_PADDING, PADDING);
    ctx.lineTo(AXIS_PADDING, canvas.height - AXIS_PADDING);
    ctx.stroke();

    // Eje X
    ctx.beginPath();
    ctx.moveTo(AXIS_PADDING, canvas.height - AXIS_PADDING);
    ctx.lineTo(canvas.width - PADDING, canvas.height - AXIS_PADDING);
    ctx.stroke();

    // 6. Dibujar etiquetas de décadas
    ctx.fillStyle = "#ffffff";
    ctx.font = `${18 * scale}px system-ui, -apple-system, sans-serif`;
    ctx.textAlign = "center";

    const decades = Array.from(new Set(years.map((year) => Math.floor(year / 10) * 10))).sort((a, b) => a - b);

    decades.forEach((decade, index) => {
      // Recalcular inicio y fin de la década basado en el índice
      const decadeStartX = AXIS_PADDING + years.indexOf(decade) * YEAR_WIDTH;
      const decadeEndX = decadeStartX + YEAR_WIDTH * 10; // Cada década cubre 10 columnas
      const decadeCenterX = (decadeStartX + decadeEndX) / 2;

      // Ajustar etiquetas en los extremos
      if (index === 0) {
        // Primera década: ajustamos el rango al inicio
        const firstYearX = AXIS_PADDING + 0 * YEAR_WIDTH; // Inicio absoluto
        const endFirstDecadeX = firstYearX + YEAR_WIDTH * 10; // Fin de la primera década
        const centeredFirstDecadeX = (firstYearX + endFirstDecadeX) / 2;

        ctx.fillText(decade.toString(), centeredFirstDecadeX, canvas.height - AXIS_PADDING + 30 * scale);
      } else if (index === decades.length - 1) {
        // Última década: ajustamos el rango al final
        const lastYearX = AXIS_PADDING + (years.length - 10) * YEAR_WIDTH; // Inicio de la última década
        const endLastDecadeX = lastYearX + YEAR_WIDTH * 10; // Fin absoluto
        const centeredLastDecadeX = (lastYearX + endLastDecadeX) / 2;

        ctx.fillText(decade.toString(), centeredLastDecadeX, canvas.height - AXIS_PADDING + 30 * scale);
      } else {
        // Décadas intermedias se centran normalmente
        ctx.fillText(decade.toString(), decadeCenterX, canvas.height - AXIS_PADDING + 30 * scale);
      }

      // Línea divisoria al inicio de la década
      ctx.beginPath();
      ctx.moveTo(decadeStartX, canvas.height - AXIS_PADDING);
      ctx.lineTo(decadeStartX, canvas.height - AXIS_PADDING + 10 * scale);
      ctx.stroke();
    });

    // 7. Renderizar "torres" de álbumes por año
    years.forEach((year, index) => {
      const yearStartX = AXIS_PADDING + index * YEAR_WIDTH;

      tracksByYear[year].forEach((track, trackIndex) => {
        const x = yearStartX;
        const y = canvas.height - AXIS_PADDING - (trackIndex + 1) * ALBUM_SIZE;

        imageQueueRef.current.push({
          x,
          y,
          size: ALBUM_SIZE,
          url: track.albumPicUrl,
        });
      });
    });

    // 8. Dibujar las imágenes en el canvas
    imageQueueRef.current.forEach(({ x, y, size, url }) => {
      drawImage(ctx, url, x, y, size);
    });
  }, [tracks, scale, drawImage]);

  const handleZoomIn = () => setScale((prev) => Math.min(prev + 0.1, 2));
  const handleZoomOut = () => setScale((prev) => Math.max(prev - 0.1, 0.5));

  if (loading) {
    return (
      <div className='w-full p-6 bg-[#121212] rounded-lg'>
        <div className='text-white text-center'>Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='w-full p-6 bg-[#121212] rounded-lg'>
        <div className='text-red-500 text-center'>{error}</div>
      </div>
    );
  }

  return (
    <div className='w-full bg-[#121212] rounded-lg p-6 shadow-lg'>
      <div className='mb-6 flex justify-between items-center'>
        <h2 className='text-white text-2xl font-bold font-sans'>Your Music Through the Decades</h2>
        <div className='flex gap-2'>
          <button
            onClick={handleZoomOut}
            className='px-3 py-1 bg-[#282828] text-white rounded hover:bg-[#3e3e3e] transition-colors'
          >
            -
          </button>
          <button
            onClick={handleZoomIn}
            className='px-3 py-1 bg-[#282828] text-white rounded hover:bg-[#3e3e3e] transition-colors'
          >
            +
          </button>
        </div>
      </div>
      <div
        className='relative w-full bg-[#181818] rounded-lg p-4 overflow-auto'
        style={{ height: "auto", maxHeight: "400px" }}
      >
        <div ref={containerRef} className='relative pb-8'>
          <canvas ref={canvasRef} className='max-w-none' />
        </div>
      </div>
    </div>
  );
}
