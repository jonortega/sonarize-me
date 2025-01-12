"use client";

import { useEffect, useRef, useState } from "react";

export interface TrackData {
  id: string;
  albumPicUrl: string;
  year: number;
}

export interface DecadeData {
  decade: number;
  tracks: TrackData[];
}

export default function TusDecadas() {
  const [tracks, setTracks] = useState<TrackData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

  useEffect(() => {
    if (!tracks.length || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

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
    const ALBUM_SIZE = 30;
    const PADDING = 20;
    const AXIS_PADDING = 80;
    const DECADE_LABEL_HEIGHT = 30;

    // Set canvas size
    canvas.width = Math.max(800, window.innerWidth * 0.8);
    canvas.height = 600;

    // Clear canvas
    ctx.fillStyle = "#121212"; // Spotify dark background
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw axes
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;

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
    ctx.font = "18px Circular";
    ctx.textAlign = "center";
    decadeGroups.forEach((group, index) => {
      const x = AXIS_PADDING + index * ((canvas.width - AXIS_PADDING - PADDING) / decadeGroups.length);

      // Draw decade label
      ctx.fillText(group.decade.toString(), x, canvas.height - AXIS_PADDING + DECADE_LABEL_HEIGHT);

      // Draw divisory line
      ctx.beginPath();
      ctx.moveTo(x, canvas.height - AXIS_PADDING);
      ctx.lineTo(x, canvas.height - AXIS_PADDING + 10);
      ctx.stroke();
    });

    // Draw album covers
    decadeGroups.forEach((group, decadeIndex) => {
      const baseX = AXIS_PADDING + decadeIndex * ((canvas.width - AXIS_PADDING - PADDING) / decadeGroups.length);

      group.tracks.forEach((track, trackIndex) => {
        const x = baseX + trackIndex * ALBUM_SIZE;
        const y =
          canvas.height -
          AXIS_PADDING -
          ALBUM_SIZE -
          Math.floor(
            trackIndex / Math.floor((canvas.width - AXIS_PADDING - PADDING) / decadeGroups.length / ALBUM_SIZE)
          ) *
            ALBUM_SIZE;

        // Load and draw album cover
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = track.albumPicUrl;
        img.onload = () => {
          ctx.drawImage(img, x, y, ALBUM_SIZE, ALBUM_SIZE);
        };
      });
    });
  }, [tracks]);

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
      <div className='mb-6'>
        <h2 className='text-white text-2xl font-bold'>Your Music Through the Decades</h2>
      </div>
      <div className='relative w-full aspect-[4/3] bg-[#181818] rounded-lg p-4'>
        <canvas ref={canvasRef} className='w-full h-full' />
      </div>
    </div>
  );
}
