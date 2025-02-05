"use client";

import Image from "next/image";
import { Album, HallOfFameData } from "@/lib/types";
import { useFetch } from "@/lib/useFetch";
import Loading from "@/components/Loading";
import { useRef, useState } from "react";
import html2canvas from "html2canvas";

export default function HallOfFame() {
  const gridRef = useRef<HTMLDivElement>(null);
  const [isCreating, setIsCreating] = useState(false);

  const { data, loading, error } = useFetch<HallOfFameData>("/api/stats/hall-of-fame");

  const optimizeImage = async (canvas: HTMLCanvasElement, maxSize: number): Promise<string> => {
    let quality = 0.9;
    let imageBase64: string;
    let size: number;

    do {
      imageBase64 = canvas.toDataURL("image/jpeg", quality).split(",")[1];
      size = Math.round((imageBase64.length * 0.75) / 1024);
      console.log(`Trying quality: ${quality.toFixed(2)}, size: ${size}KB`);
      quality -= 0.1;
    } while (size > maxSize && quality > 0.1);

    if (size > maxSize) {
      // If still too large, reduce dimensions
      const scaledCanvas = document.createElement("canvas");
      const ctx = scaledCanvas.getContext("2d");
      const scale = Math.sqrt(maxSize / size); // Scale factor to reduce dimensions

      scaledCanvas.width = canvas.width * scale;
      scaledCanvas.height = canvas.height * scale;

      if (ctx) {
        ctx.drawImage(canvas, 0, 0, scaledCanvas.width, scaledCanvas.height);
        imageBase64 = scaledCanvas.toDataURL("image/jpeg", 0.7).split(",")[1];
        size = Math.round((imageBase64.length * 0.75) / 1024);
        console.log(`Scaled down image. Final size: ${size}KB`);
      }
    }

    return imageBase64;
  };

  const handleCreatePlaylist = async () => {
    console.log("Creando playlist...");

    try {
      setIsCreating(true);

      if (!gridRef.current) {
        throw new Error("No se pudo acceder al elemento de la cuadrícula");
      }

      // Create a wrapper div with exact dimensions
      const wrapper = document.createElement("div");
      wrapper.style.position = "fixed";
      wrapper.style.top = "-9999px"; // Position off-screen
      wrapper.style.backgroundColor = "#000000";
      wrapper.style.width = "600px"; // Larger fixed size for better quality
      wrapper.style.height = "600px";
      wrapper.style.display = "flex";
      wrapper.style.justifyContent = "center";
      wrapper.style.alignItems = "center";

      // Clone the grid and set its size to match wrapper
      const gridClone = gridRef.current.cloneNode(true) as HTMLElement;
      gridClone.style.width = "600px";
      gridClone.style.height = "600px";

      wrapper.appendChild(gridClone);
      document.body.appendChild(wrapper);

      // Ensure all images are loaded before capture
      const images = wrapper.getElementsByTagName("img");
      await Promise.all(
        Array.from(images).map((img) => {
          if (img.complete) return Promise.resolve();
          return new Promise((resolve) => {
            img.onload = resolve;
            img.onerror = resolve; // Handle error case as well
          });
        })
      );

      // Capture with optimized settings
      const canvas = await html2canvas(wrapper, {
        backgroundColor: "#000000",
        scale: 1, // Scale 1 since we're already using a larger base size
        useCORS: true,
        allowTaint: true,
        logging: false,
        width: 600,
        height: 600,
        imageTimeout: 0,
      });

      // Clean up
      document.body.removeChild(wrapper);

      // Optimize image - target 200KB to be safe
      const imageBase64 = await optimizeImage(canvas, 200);

      const response = await fetch("/api/stats/hall-of-fame", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ coverImage: imageBase64 }),
      });

      if (!response.ok) {
        throw new Error("Error al crear la playlist");
      }

      alert("¡Playlist creada con éxito!");
    } catch (error) {
      console.error("Error:", error);
      alert("No se pudo crear la playlist. Por favor, inténtalo de nuevo.");
    } finally {
      setIsCreating(false);
    }
  };

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
    <div className='flex flex-col items-center'>
      <div
        ref={gridRef}
        className='grid grid-cols-4 gap-0 mx-auto'
        style={{
          width: "600px",
          height: "600px",
          overflow: "hidden",
        }}
      >
        {/* Antes era: style={{ width: "75%", height: "auto" }} */}
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
              sizes='(max-width: 600px) 150px, 200px' // Antes estaba a: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
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
      <div className='mt-8 flex justify-center'>
        <button
          onClick={handleCreatePlaylist}
          disabled={isCreating}
          className='bg-spotify-green hover:bg-spotify-green-light text-black font-bold py-3 px-8 rounded-full transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:bg-spotify-green'
        >
          {isCreating ? (
            <span className='flex items-center'>
              <svg
                className='animate-spin -ml-1 mr-3 h-5 w-5 text-black'
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
              >
                <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                <path
                  className='opacity-75'
                  fill='currentColor'
                  d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                ></path>
              </svg>
              Creando playlist...
            </span>
          ) : (
            'Crear playlist "Hall Of Fame"'
          )}
        </button>
      </div>
    </div>
  );
}
