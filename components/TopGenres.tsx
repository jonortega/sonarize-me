import { Genre } from "@/lib/types";
import { Hash } from "lucide-react";

export default function TopGenres({ genres }: { genres: Genre[] }) {
  return (
    <div className='bg-spotify-black bg-opacity-30 p-4 rounded-lg'>
      <h2 className='text-2xl font-bold mb-4 flex items-center'>
        <Hash className='mr-2 text-spotify-green' />
        Top Genres
      </h2>
      <ul className='flex flex-wrap gap-2'>
        {genres.map((genre) => (
          <li key={genre.name} className='bg-spotify-green bg-opacity-20 px-3 py-1 rounded-full text-sm'>
            {genre.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
