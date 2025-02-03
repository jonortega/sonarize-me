"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Clock, ChevronDown, ChevronUp } from "lucide-react";

interface RecentTrack {
  id: string;
  name: string;
  artist: string;
  album: string;
  albumArtUrl: string;
  playedAt: string;
}

export default function RecentlyPlayed() {
  const [recentTracks, setRecentTracks] = useState<RecentTrack[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    let isAborted = false;

    const fetchRecentlyPlayed = async () => {
      console.log("=== INICIO DE FETCH, setLoading(true) ===");
      setLoading(true);
      setRecentTracks([]); // Limpia datos anteriores para evitar inconsistencias

      try {
        const response = await fetch("/api/home/recently-played", {
          credentials: "include", // Incluye cookies en la solicitud
          signal, // Permite abortar la solicitud si el componente se desmonta
        });

        if (!response.ok) {
          throw new Error("Failed to fetch recently played tracks");
        }

        const data: RecentTrack[] = await response.json();
        setRecentTracks(data);
      } catch (error) {
        if ((error as Error).name === "AbortError") {
          console.log("=== FETCH ABORTADO ===");
          isAborted = true;
          return;
        }
        console.error("Error fetching recently played tracks:", error);
        setError("Failed to load recently played tracks. Please try again later.");
      } finally {
        if (!isAborted) {
          console.log("=== FIN DE FETCH, setLoading(false) ===");
          setLoading(false);
        }
      }
    };

    fetchRecentlyPlayed();

    return () => {
      console.log("=== ABORTANDO FETCH ===");
      isAborted = true; // Evita actualizaciones de estado tras desmontar
      controller.abort();
    };
  }, []);

  const displayedTracks = showAll ? recentTracks : recentTracks.slice(0, 10);

  return (
    <div className='bg-spotify-gray-300 p-6 rounded-lg border border-spotify-gray-200'>
      <h2 className='text-2xl font-bold mb-6 flex items-center'>
        <Clock className='mr-2 text-spotify-green' />
        Recently Played
      </h2>
      {loading ? (
        <p className='text-center text-spotify-gray-100'>Loading...</p>
      ) : error ? (
        <p className='text-center text-spotify-red'>{error}</p>
      ) : recentTracks.length > 0 ? (
        <>
          <div className='w-full'>
            <div className='grid grid-cols-[auto_1fr_1fr_auto] gap-4 text-sm text-spotify-gray-100 px-4 pb-2'>
              <div>#</div>
              <div>Title</div>
              <div>Album</div>
              <div>Played At</div>
            </div>
            <ul className='space-y-2'>
              {displayedTracks.map((track, index) => (
                <li
                  key={track.id}
                  className='grid grid-cols-[auto_1fr_1fr_auto] gap-4 items-center px-4 py-2 rounded-md hover:bg-white/5'
                >
                  <span className='text-spotify-gray-100 w-4 text-right'>{index + 1}</span>
                  <div className='flex items-center space-x-3 min-w-0'>
                    <Image src={track.albumArtUrl} alt={track.album} width={40} height={40} className='rounded' />
                    <div className='min-w-0'>
                      <p className='font-medium truncate'>{track.name}</p>
                      <p className='text-sm text-spotify-gray-100 truncate'>{track.artist}</p>
                    </div>
                  </div>
                  <div className='text-spotify-gray-100 truncate'>{track.album}</div>
                  <div className='text-spotify-gray-100 whitespace-nowrap'>{track.playedAt}</div>
                </li>
              ))}
            </ul>
          </div>
          <div className='flex justify-center mt-6'>
            <button
              onClick={() => setShowAll(!showAll)}
              className='px-8 py-2 bg-spotify-gray-200 hover:bg-spotify-gray-200/80 text-white rounded-full transition-colors duration-200 flex items-center justify-center'
            >
              {showAll ? (
                <>
                  <ChevronUp className='mr-2' />
                  Show Less
                </>
              ) : (
                <>
                  <ChevronDown className='mr-2' />
                  Show All
                </>
              )}
            </button>
          </div>
        </>
      ) : (
        <p className='text-center text-spotify-gray-100'>No recently played tracks available.</p>
      )}
    </div>
  );
}
