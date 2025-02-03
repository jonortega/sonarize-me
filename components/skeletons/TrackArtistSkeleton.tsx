import SkeletonBlock from "@/components/skeletons/SkeletonBlock";

interface ListSkeletonProps {
  count: number;
}

export default function ListSkeleton({ count }: ListSkeletonProps) {
  return (
    <div className='bg-spotify-gray-300 p-4 rounded-lg border-2 border-spotify-gray-200 h-full'>
      <h2 className='text-2xl font-bold mb-4 flex items-center'>
        <div className='mr-2 w-6 h-6 bg-spotify-green rounded-full animate-pulse'></div> {/* Icono Placeholder */}
        <SkeletonBlock width='30%' height='1.2rem' /> {/* Título */}
      </h2>
      <ul className='space-y-4'>
        {Array.from({ length: count }).map((_, index) => (
          <li key={index} className='flex items-center space-x-3'>
            <span className='text-spotify-green font-bold min-w-[24px]'>
              <SkeletonBlock width='24px' height='1rem' />
            </span>
            <SkeletonBlock width='50px' height='50px' rounded /> {/* Imagen */}
            <div className='flex-grow min-w-0 space-y-2'>
              <SkeletonBlock width='80%' height='1rem' /> {/* Nombre del track */}
              <SkeletonBlock width='60%' height='0.8rem' /> {/* Artista */}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
