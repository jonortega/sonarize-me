import SkeletonBlock from "@/components/skeletons/SkeletonBlock";

interface GenreSkeletonProps {
  count: number;
}

export default function GenreSkeleton({ count }: GenreSkeletonProps) {
  return (
    <div className='bg-spotify-gray-300 bg-opacity-30 p-4 rounded-lg border-2 border-spotify-gray-200'>
      <h2 className='text-2xl font-bold mb-4 flex items-center'>
        <div className='mr-2 w-6 h-6 bg-spotify-green rounded-full animate-pulse'></div> {/* Icono Placeholder */}
        <SkeletonBlock width='30%' height='1.2rem' /> {/* Título */}
      </h2>
      <ul className='flex flex-wrap gap-2'>
        {Array.from({ length: count }).map((_, index) => (
          <li
            key={index}
            className='bg-spotify-gray-700 bg-opacity-20 px-3 py-1 rounded-full animate-pulse'
            style={{ width: "80px", height: "24px" }}
          />
        ))}
      </ul>
    </div>
  );
}
