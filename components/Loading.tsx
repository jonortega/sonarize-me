"use client";

import { useState, useEffect } from "react";

const phrases = [
  { action: "Cargando", subject: "estadísticas" },
  { action: "Procesando", subject: "datos" },
  { action: "Analizando", subject: "información" },
  { action: "Calculando", subject: "resultados" },
  { action: "Preparando", subject: "visualizaciones" },
  { action: "Sincronizando", subject: "métricas" },
];

export default function Loading() {
  const [phraseIndex, setPhraseIndex] = useState(() => Math.floor(Math.random() * phrases.length));
  const [dots, setDots] = useState("");
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const dotInterval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);

    const phraseInterval = setInterval(() => {
      setFadeOut(true);
      setTimeout(() => {
        setPhraseIndex((prev) => (prev + 1) % phrases.length);
        setFadeOut(false);
      }, 500); // Half the interval for smooth transition
    }, 3000);

    return () => {
      clearInterval(dotInterval);
      clearInterval(phraseInterval);
    };
  }, []);

  const { action, subject } = phrases[phraseIndex];

  return (
    <div className='flex items-center justify-center h-40 bg-spotify-black text-spotify-white rounded-lg shadow-lg'>
      <p className={`text-lg font-semibold transition-opacity duration-500 ${fadeOut ? "opacity-0" : "opacity-100"}`}>
        <span className='text-spotify-green'>{action}</span> {subject}
        <span className='inline-block w-8 text-left'>{dots}</span>
      </p>
    </div>
  );
}
