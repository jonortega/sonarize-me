"use client";

import Image from "next/image";
import { Album, HallOfFameData } from "@/lib/types";
import { useFetch } from "@/lib/useFetch";
import Loading from "@/components/Loading";

export default function HallOfFame() {
  const { data, loading, error } = useFetch<HallOfFameData>("/api/stats/hall-of-fame");

  const handleAlbumClick = (album: Album) => {
    // This function can be implemented in the future to handle click events
    console.log("Album clicked:", album);
  };

  if (loading) {
    return <Loading />;
  }

  if (error || !data) {
    return (
      <div className='text-white'>
        <p>{error || "No se ha podido cargar tu Hall Of Fame. Por favor, inténtalo de nuevo más tarde."}</p>
      </div>
    );
  }

  return (
    <div>
      <div className='grid grid-cols-4 gap-0 mx-auto' style={{ width: "75%", height: "auto" }}>
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
              className='transition-transform duration-300 ease-in-out group-hover:scale-110 group-hover:z-[10]' // Cambiar z-index dinámicamente
            />
            <div className='absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-opacity duration-300 flex items-end justify-start p-2 z-[20]'>
              <div className='text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                <p className='font-semibold text-sm text-ellipsis'>{album.track}</p>
                <p className='text-xs text-spotify-gray-100 text-ellipsis'>{album.artist}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
