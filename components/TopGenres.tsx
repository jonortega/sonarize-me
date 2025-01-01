import { Genre } from "@/lib/types";
import { Hash } from "lucide-react";

export default function TopGenres({ genres }: { genres: Genre[] }) {
  return (
    <div className='bg-spotify-gray-300 bg-opacity-30 p-4 rounded-lg border-2 border-spotify-gray-200'>
      <h2 className='text-2xl font-bold mb-4 flex items-center'>
        <Hash className='mr-2 text-spotify-green' />
        Top Genres
      </h2>
      <ul className='flex flex-wrap gap-2'>
        {genres.map((genre, index) => (
          <li key={genre.name} className='bg-spotify-green bg-opacity-20 px-3 py-1 rounded-full text-sm'>
            <span className='text-spotify-white font-bold mr-2'>#{index + 1}</span>
            <span className='truncate'>{genre.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
