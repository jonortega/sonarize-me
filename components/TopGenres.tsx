import { cookies } from "next/headers";
import { Hash } from "lucide-react";
import { Genre } from "@/lib/types";

async function fetchTopGenres(): Promise<Genre[]> {
  try {
    const cookieStore = await cookies();
    const access_token = cookieStore.get("access_token")?.value;
    if (!access_token) throw new Error("No access token");

    const response = await fetch("http://localhost:3000/api/home/top-genres", {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    if (!response.ok) throw new Error("Failed to fetch top genres");
    return response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default async function TopGenres() {
  const genres = await fetchTopGenres();

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
