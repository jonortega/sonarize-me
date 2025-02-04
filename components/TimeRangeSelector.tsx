"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

const timeRanges = [
  { value: "short_term", label: "Este Mes" },
  { value: "medium_term", label: "Últimos 6 Meses" },
  { value: "long_term", label: "Todo el Año" },
];

export default function TimeRangeSelector() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const currentTimeRange = searchParams.get("time_range") || "short_term";

  const handleValueChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("time_range", value);
    router.push(`/home?${params.toString()}`, { scroll: false });
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentLabel = timeRanges.find((range) => range.value === currentTimeRange)?.label;

  return (
    <div className='flex justify-center mb-4'>
      <div className='relative w-[180px]' ref={dropdownRef}>
        {/* Botón del dropdown */}
        <button
          type='button'
          onClick={() => setIsOpen(!isOpen)}
          className='w-full px-4 py-2 bg-spotify-gray-300 border border-spotify-gray-200 rounded-3xl text-spotify-white flex items-center justify-between hover:bg-spotify-gray-200 transition-colors shadow-md'
        >
          <span className='font-medium'>{currentLabel}</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "transform rotate-180" : ""}`} />
        </button>

        {/* Menú desplegable */}
        {isOpen && (
          <div className='absolute w-full mt-2 bg-spotify-gray-300 border border-spotify-gray-200 rounded-lg shadow-xl z-10'>
            {timeRanges.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => handleValueChange(value)}
                className={`w-full px-4 py-2 text-left text-spotify-white font-medium hover:bg-spotify-gray-200 transition-colors rounded-md ${
                  value === currentTimeRange ? "bg-spotify-gray-200" : ""
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
