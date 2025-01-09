"use client";

import { CalendarClock, Award, Fingerprint, BookMarked, X } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const statComponents = {
  "hall-of-fame": dynamic(() => import("@/components/stats/HallOfFame")),
  "estaciones-musicales": dynamic(() => import("@/components/stats/EstacionesMusicales")),
  "huella-del-dia": dynamic(() => import("@/components/stats/HuellaDelDia")),
  "la-bitacora": dynamic(() => import("@/components/stats/LaBitacora")),
  // Insertar más componentes dinámicos aquí
};

const statIcons = {
  "hall-of-fame": Award,
  "estaciones-musicales": CalendarClock,
  "huella-del-dia": Fingerprint,
  "la-bitacora": BookMarked,
  // Insertar más iconos aquí (importarlos de "lucide-react")
};

export default function StatWrapper() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const statId = searchParams.get("stat");

  const closeModal = () => {
    router.push("/stats");
  };

  if (!statId) return null;

  const StatComponent = statComponents[statId as keyof typeof statComponents];
  const StatIcon = statIcons[statId as keyof typeof statIcons];

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
          overflow: "hidden",
        }}
      >
        <div className='flex justify-between items-center mb-4'>
          <div className='flex items-center mb-4'>
            {StatIcon && <StatIcon className='w-8 h-8 text-spotify-green mr-3' />}
            <h2 className='text-2xl font-bold text-white'>{title}</h2>
          </div>

          <button onClick={closeModal} className='text-spotify-gray-100 hover:text-white'>
            <X size={24} />
          </button>
        </div>
        <div className='text-spotify-gray-100 grow m-6'>
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
