import { ReactNode } from "react";

interface StatSquareProps {
  title: string;
  children: ReactNode;
}

export default function StatSquare({ title, children }: StatSquareProps) {
  return (
    <div className='bg-spotify-gray-300 p-6 rounded-lg border border-spotify-gray-200 hover:bg-spotify-gray-200 transition-colors cursor-pointer'>
      <h3 className='text-xl font-bold mb-4 text-white'>{title}</h3>
      <div className='text-spotify-gray-100'>{children}</div>
    </div>
  );
}
