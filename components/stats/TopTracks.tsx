// components/stats/TopTracks.tsx
"use client";

import { useState, useEffect } from "react";
import { Track } from "@/lib/types";

export default function TopTracks() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const response = await fetch("/api/stats/top-tracks");
        const data = await response.json();
        setTracks(data);
      } catch (error) {
        console.error("Error fetching top tracks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTracks();
  }, []);

  if (loading) return <p>Loading top tracks...</p>;

  return (
    <ul className='space-y-4'>
      {tracks.map((track, index) => (
        <li key={index} className='bg-spotify-gray-200 p-4 rounded-lg'>
          <p className='text-white font-semibold'>{track.name}</p>
          <p>{track.artist}</p>
          <p className='text-sm text-spotify-gray-100'>Album: {track.album}</p>
          <p className='text-sm text-spotify-green'>Plays: {track.playCount}</p>
        </li>
      ))}
    </ul>
  );
}
