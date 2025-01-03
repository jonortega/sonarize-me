"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

interface StatModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  statId: string;
}

interface Track {
  name: string;
  artist: string;
  album: string;
  playCount: number;
}

interface Artist {
  name: string;
  genre: string;
  totalPlays: number;
  topTrack: string;
}

export default function StatModal({ isOpen, onClose, title, statId }: StatModalProps) {
  const [data, setData] = useState<Track[] | Artist[] | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchStatData(statId);
    }
  }, [isOpen, statId]);

  const fetchStatData = async (id: string) => {
    try {
      const response = await fetch(`/api/stats/${id}`);
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error("Error fetching stat data:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50'>
      <div
        className='bg-spotify-gray-300 rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto shadow-lg animate-popup'
        style={{
          boxShadow: "0 10px 25px rgba(0, 0, 0, 0.5)",
        }}
      >
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-2xl font-bold text-white'>{title}</h2>
          <button onClick={onClose} className='text-spotify-gray-100 hover:text-white'>
            <X size={24} />
          </button>
        </div>
        <div className='text-spotify-gray-100'>
          {data ? (
            <ul className='space-y-4'>
              {data.map((item, index) => (
                <li key={index} className='bg-spotify-gray-200 p-4 rounded-lg'>
                  {"name" in item && "artist" in item ? (
                    <>
                      <p className='text-white font-semibold'>{item.name}</p>
                      <p>{item.artist}</p>
                      <p className='text-sm text-spotify-gray-100'>Album: {item.album}</p>
                      <p className='text-sm text-spotify-green'>Plays: {item.playCount}</p>
                    </>
                  ) : (
                    <>
                      <p className='text-white font-semibold'>{item.name}</p>
                      <p>{item.genre}</p>
                      <p className='text-sm text-spotify-gray-100'>Top Track: {item.topTrack}</p>
                      <p className='text-sm text-spotify-green'>Total Plays: {item.totalPlays}</p>
                    </>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </div>
    </div>
  );
}

const popupKeyframes = `
  @keyframes popup {
    0% {
      opacity: 0;
      transform: scale(0.9) translateY(20px);
    }
    100% {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }
`;

<style jsx global>{`
  ${popupKeyframes}
  .animate-popup {
    animation: popup 0.3s ease-out forwards;
  }
`}</style>;
