import { ReactNode } from "react";
import { type LucideIcon } from "lucide-react";

interface StatSquareProps {
  title: string;
  children: ReactNode;
  icon: LucideIcon;
  className?: string;
}

export default function StatSquare({ title, children, icon: Icon, className = "" }: StatSquareProps) {
  return (
    <div
      className={`bg-spotify-gray-300 p-6 rounded-lg border border-spotify-gray-200 hover:bg-spotify-gray-200 transition-colors cursor-pointer flex flex-col ${className}`}
    >
      <div className='flex items-center mb-4'>
        <Icon className='w-8 h-8 text-spotify-green mr-3' />
        <h3 className='text-xl font-bold text-white'>{title}</h3>
      </div>
      <div className='text-spotify-gray-100 flex-grow'>{children}</div>
    </div>
  );
}
