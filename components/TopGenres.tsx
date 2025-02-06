import { cookies } from "next/headers";
import { Hash } from "lucide-react";
import { Genre } from "@/lib/types";

const DOMAIN_URL = process.env.DOMAIN_URL;

async function fetchTopGenres(timeRange: string): Promise<Genre[]> {
  try {
    const cookieStore = await cookies();
    const access_token = cookieStore.get("access_token")?.value;
    if (!access_token) throw new Error("No access token");

    const response = await fetch(`${DOMAIN_URL}/api/home/top-genres?time_range=${timeRange}`, {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    if (!response.ok) throw new Error("Failed to fetch top genres");

    return response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default async function TopGenres({ timeRange = "short_term" }: { timeRange?: string }) {
  const genres = await fetchTopGenres(timeRange);
  console.log("Top Genres", genres);

  // Manejo de casos donde no hay géneros
  if (genres.length === 0) {
    return (
      <div className='bg-spotify-gray-300 bg-opacity-30 p-4 rounded-lg border-2 border-spotify-gray-200'>
        <h2 className='text-2xl font-bold mb-4 flex items-center'>
          <Hash className='mr-2 text-spotify-green' />
          Top Genres
        </h2>
        <div className='text-spotify-gray-100 text-left pl-8 mb-2'>
          No hay información disponible sobre los géneros.
        </div>
      </div>
    );
  }

  return (
    <div className='bg-spotify-gray-300 bg-opacity-30 p-4 rounded-lg border-2 border-spotify-gray-200'>
      <h2 className='text-2xl font-bold mb-4 flex items-center'>
        <Hash className='mr-2 text-spotify-green' />
        Top Genres
      </h2>
      <ul className='flex flex-wrap gap-2'>
        {genres.map((genre, index) => (
          <li key={genre.name} className='bg-spotify-green bg-opacity-20 px-3 py-1 rounded-full text-sm'>
            <span className='text-spotify-gray-300 font-bold mr-2'>#{index + 1}</span>
            <span className='truncate text-spotify-gray-300'>{genre.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
