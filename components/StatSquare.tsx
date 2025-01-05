"use client";

import { useRouter } from "next/navigation";
import { type LucideIcon } from "lucide-react";
import * as Icons from "lucide-react";

interface StatSquareProps {
  title: string;
  iconName: keyof typeof Icons;
  className?: string;
  statId: string;
}

export default function StatSquare({ title, iconName, className = "", statId }: StatSquareProps) {
  const router = useRouter();
  const IconComponent = Icons[iconName] as LucideIcon;

  const openStat = () => {
    router.push(`/stats?stat=${statId}`);
  };

  return (
    <div
      className={`bg-spotify-gray-300 p-6 rounded-lg border border-spotify-gray-200 hover:bg-spotify-gray-200 transition-colors cursor-pointer flex flex-col ${className}`}
      onClick={openStat}
    >
      <div className='flex items-center mb-4'>
        <IconComponent className='w-8 h-8 text-spotify-green mr-3' />
        <h3 className='text-xl font-bold text-white'>{title}</h3>
      </div>
    </div>
  );
}
