// components/StatSquare.tsx
"use client";

import { ReactNode } from "react";
import { type LucideIcon } from "lucide-react";
import { useRouter } from "next/navigation";

interface StatSquareProps {
  title: string;
  icon: LucideIcon;
  className?: string;
  statId: string;
}

export default function StatSquare({ title, icon: Icon, className = "", statId }: StatSquareProps) {
  const router = useRouter();

  const openStat = () => {
    router.push(`/stats?stat=${statId}`);
  };

  return (
    <div
      className={`bg-spotify-gray-300 p-6 rounded-lg border border-spotify-gray-200 hover:bg-spotify-gray-200 transition-colors cursor-pointer flex flex-col ${className}`}
      onClick={openStat}
    >
      <div className='flex items-center mb-4'>
        <Icon className='w-8 h-8 text-spotify-green mr-3' />
        <h3 className='text-xl font-bold text-white'>{title}</h3>
      </div>
    </div>
  );
}
