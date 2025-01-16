"use client";

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
    const fetchTracks = async () => {
      try {
        const response = await fetch("/api/stats/tus-decadas");
        if (!response.ok) throw new Error("Failed to fetch tracks");
        const data = await response.json();
        setTracks(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchTracks();
  }, []);

  const drawImage = useCallback((ctx: CanvasRenderingContext2D, url: string, x: number, y: number, size: number) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = url;
    img.onload = () => {
      ctx.drawImage(img, x, y, size, size);
    };
  }, []);

  useEffect(() => {
    if (!tracks.length || !canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctxRef.current = ctx;
    imageQueueRef.current = []; // Clear previous image queue

    // Group tracks by decade
    const decadeGroups = tracks.reduce<DecadeData[]>((acc, track) => {
      const decade = Math.floor(track.year / 10) * 10;
      const decadeGroup = acc.find((group) => group.decade === decade);

      if (decadeGroup) {
        decadeGroup.tracks.push(track);
      } else {
        acc.push({ decade, tracks: [track] });
      }

      return acc;
    }, []);

    // Sort decades
    decadeGroups.sort((a, b) => a.decade - b.decade);

    // Calculate dimensions
    const ALBUM_SIZE = 30 * scale;
    const ALBUMS_PER_ROW = 8;
    const PADDING = 20 * scale;
    const AXIS_PADDING = 80 * scale;
    const DECADE_WIDTH = ALBUM_SIZE * ALBUMS_PER_ROW;

    // Calculate canvas size based on content
    const totalDecadeWidth = DECADE_WIDTH * decadeGroups.length;
    canvas.width = totalDecadeWidth + AXIS_PADDING + PADDING;

    // Calculate maximum height needed
    const maxTracksInDecade = Math.max(...decadeGroups.map((g) => g.tracks.length));
    const rowsNeeded = Math.ceil(maxTracksInDecade / ALBUMS_PER_ROW);
    const totalHeight = rowsNeeded * ALBUM_SIZE + AXIS_PADDING + PADDING * 2;
    canvas.height = totalHeight;

    // Set container minimum width to ensure horizontal scrolling works
    container.style.minWidth = `${canvas.width}px`;

    // Clear canvas
    ctx.fillStyle = "#121212";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw axes
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2 * scale;

    // Y axis
    ctx.beginPath();
    ctx.moveTo(AXIS_PADDING, PADDING);
    ctx.lineTo(AXIS_PADDING, canvas.height - AXIS_PADDING);
    ctx.stroke();

    // X axis
    ctx.beginPath();
    ctx.moveTo(AXIS_PADDING, canvas.height - AXIS_PADDING);
    ctx.lineTo(canvas.width - PADDING, canvas.height - AXIS_PADDING);
    ctx.stroke();

    // Draw decade labels and divisory lines
    ctx.fillStyle = "#ffffff";
    ctx.font = `${18 * scale}px system-ui, -apple-system, sans-serif`;
    ctx.textAlign = "center";

    decadeGroups.forEach((group, index) => {
      const decadeStartX = AXIS_PADDING + index * DECADE_WIDTH;
      const decadeCenterX = decadeStartX + DECADE_WIDTH / 2;

      // Draw decade label centered in its section
      ctx.fillText(group.decade.toString(), decadeCenterX, canvas.height - AXIS_PADDING + 30 * scale);

      // Draw decade boundary line
      ctx.beginPath();
      ctx.moveTo(decadeStartX, canvas.height - AXIS_PADDING);
      ctx.lineTo(decadeStartX, canvas.height - AXIS_PADDING + 10 * scale);
      ctx.stroke();
    });

    // Queue album covers for drawing
    decadeGroups.forEach((group, decadeIndex) => {
      const decadeStartX = AXIS_PADDING + decadeIndex * DECADE_WIDTH;

      group.tracks.forEach((track, trackIndex) => {
        const row = Math.floor(trackIndex / ALBUMS_PER_ROW);
        const col = trackIndex % ALBUMS_PER_ROW;

        const x = decadeStartX + col * ALBUM_SIZE;
        const y = canvas.height - AXIS_PADDING - (row + 1) * ALBUM_SIZE;

        imageQueueRef.current.push({
          x,
          y,
          size: ALBUM_SIZE,
          url: track.albumPicUrl,
        });
      });
    });

    // Draw all queued images
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
