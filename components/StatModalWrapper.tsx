// components/StatModalWrapper.tsx
"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const statComponents = {
  "top-tracks": dynamic(() => import("@/components/stats/TopTracks")),
  "top-artists": dynamic(() => import("@/components/stats/TopArtists")),
  "listening-time": dynamic(() => import("@/components/stats/ListeningTime")),
  "genre-distribution": dynamic(() => import("@/components/stats/GenreDistribution")),
  "listening-history": dynamic(() => import("@/components/stats/ListeningHistory")),
  recommendations: dynamic(() => import("@/components/stats/Recommendations")),
};

export default function StatModalWrapper() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const statId = searchParams.get("stat");

  const closeModal = () => {
    router.push("/stats");
  };

  if (!statId) return null;

  const StatComponent = statComponents[statId as keyof typeof statComponents];
  const title = statId
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

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
          <button onClick={closeModal} className='text-spotify-gray-100 hover:text-white'>
            <X size={24} />
          </button>
        </div>
        <div className='text-spotify-gray-100'>
          <StatComponent />
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
