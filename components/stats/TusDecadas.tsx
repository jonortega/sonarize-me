"use client";

import { useEffect, useRef, useState, useCallback } from "react";

export interface TrackData {
  id: string;
  albumPicUrl: string;
  year: number;
}

type TracksByYear = {
  [year: number]: TrackData[];
};

export default function TusDecadas() {
  const [tracks, setTracks] = useState<TrackData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const [zoomLevel, setZoomLevel] = useState<"full" | "detailed">("full");
  const [focusPoint, setFocusPoint] = useState({ x: 0, y: 0 });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  // Fetch data
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
        if ((err as Error).name !== "AbortError") {
          setError(err instanceof Error ? err.message : "An error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTracks();

    return () => {
      controller.abort();
    };
  }, []);

  // Draw images
  const drawImage = useCallback((ctx: CanvasRenderingContext2D, url: string, x: number, y: number, size: number) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = url;
    img.onload = () => {
      ctx.drawImage(img, x, y, size, size);
    };
    img.onerror = () => {
      console.error(`Error al cargar la imagen desde ${url}`);
      ctx.fillStyle = "#ff0000";
      ctx.fillRect(x, y, size, size);
    };
  }, []);

  // Render canvas
  const renderCanvas = useCallback(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctxRef.current = ctx;

    const ALBUM_SIZE = 30 * scale;
    const PADDING = 20 * scale;
    const AXIS_PADDING = 80 * scale;
    const YEAR_WIDTH = ALBUM_SIZE;

    const tracksByYear: TracksByYear = tracks.reduce((acc: TracksByYear, track: TrackData) => {
      const year = track.year;
      if (!acc[year]) {
        acc[year] = [];
      }
      acc[year].push(track);
      return acc;
    }, {});

    const years = Object.keys(tracksByYear)
      .map((year) => Number(year))
      .sort((a, b) => a - b);

    const totalWidth = years.length * YEAR_WIDTH + AXIS_PADDING + PADDING;
    const maxTracksInYear = Math.max(...Object.values(tracksByYear).map((tracks) => tracks.length));
    const totalHeight = maxTracksInYear * ALBUM_SIZE + AXIS_PADDING + PADDING * 2;

    canvas.width = totalWidth;
    canvas.height = totalHeight;

    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (zoomLevel === "detailed") {
      ctx.translate(-focusPoint.x * scale + canvas.width / 2, -focusPoint.y * scale + canvas.height / 2);
    }

    ctx.scale(scale, scale);

    ctx.fillStyle = "#121212";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    years.forEach((year, index) => {
      const yearStartX = AXIS_PADDING + index * YEAR_WIDTH;

      tracksByYear[year].forEach((track, trackIndex) => {
        const x = yearStartX;
        const y = canvas.height - AXIS_PADDING - (trackIndex + 1) * ALBUM_SIZE;

        drawImage(ctx, track.albumPicUrl, x, y, ALBUM_SIZE);
      });
    });

    ctx.restore();
  }, [tracks, scale, zoomLevel, focusPoint, drawImage]);

  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  const handleZoomToggle = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    if (zoomLevel === "full") {
      setZoomLevel("detailed");
      setFocusPoint({ x, y });
      setScale(3);
    } else {
      setZoomLevel("full");
      setScale(1);
      setFocusPoint({ x: 0, y: 0 });
    }
  };

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
      <div
        className='relative w-full bg-[#181818] rounded-lg p-4 overflow-auto'
        style={{ height: "auto", maxHeight: "400px" }}
      >
        <canvas
          ref={canvasRef}
          className='max-w-none'
          style={{ cursor: zoomLevel === "full" ? "zoom-in" : "zoom-out" }}
          onClick={handleZoomToggle}
        />
      </div>
    </div>
  );
}
