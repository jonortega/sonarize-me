"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Album, HallOfFameData } from "@/lib/types";

export default function HallOfFame() {
  const [data, setData] = useState<HallOfFameData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHallOfFame = async () => {
      try {
        const response = await fetch("/api/stats/hall-of-fame", {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch Hall of Fame data");
        }

        const result: HallOfFameData = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching Hall of Fame data:", error);
        setError("Failed to load Hall of Fame data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchHallOfFame();
  }, []);

  const handleAlbumClick = (album: Album) => {
    // This function can be implemented in the future to handle click events
    console.log("Album clicked:", album);
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-spotify-green'></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className='text-white'>
        <p>{error || "Unable to load your Hall of Fame. Please try again later."}</p>
      </div>
    );
  }

  return (
    <div>
      <div className='grid grid-cols-4 gap-0 mx-auto' style={{ width: "100%", height: "auto" }}>
        {data.albums.map((album, index) => (
          <div
            key={index}
            className='relative aspect-square cursor-pointer group'
            onClick={() => handleAlbumClick(album)}
          >
            <Image
              src={album.albumArtUrl}
              alt={`${album.track} by ${album.artist}`}
              layout='fill'
              objectFit='cover'
              sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
              className='transition-transform duration-300 ease-in-out group-hover:scale-110'
            />
            <div className='absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity duration-300 flex items-end justify-start p-2'>
              <div className='text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                <p className='font-semibold text-sm truncate'>{album.track}</p>
                <p className='text-xs text-spotify-gray-100 truncate'>{album.artist}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
