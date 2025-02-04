import { cookies } from "next/headers";
import Image from "next/image";
import { Users } from "lucide-react";
import { Artist } from "@/lib/types";

async function fetchTopArtists(timeRange: string): Promise<Artist[]> {
  try {
    const cookieStore = await cookies();
    const access_token = cookieStore.get("access_token")?.value;
    if (!access_token) throw new Error("No access token");

    const response = await fetch(`http://localhost:3000/api/home/top-artists?time_range=${timeRange}`, {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    if (!response.ok) throw new Error("Failed to fetch top artists");
    return response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default async function TopArtists({ timeRange = "short_term" }: { timeRange?: string }) {
  const artists = await fetchTopArtists(timeRange);

  return (
    <div className='bg-spotify-gray-300 p-4 rounded-lg border-2 border-spotify-gray-200 h-full'>
      <h2 className='text-2xl font-bold mb-4 flex items-center'>
        <Users className='mr-2 text-spotify-green' />
        Top Artists
      </h2>
      <ul className='space-y-4'>
        {artists.map((artist, index) => (
          <li key={artist.id} className='flex items-center space-x-3'>
            <span className='text-spotify-green font-bold min-w-[24px]'>#{index + 1}</span>
            <div className='w-12 h-12 rounded-full overflow-hidden'>
              <Image
                src={artist.imageUrl}
                alt={artist.name}
                width={50}
                height={50}
                className='object-cover w-full h-full'
              />
            </div>
            <p className='font-semibold truncate flex-grow min-w-0'>{artist.name}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
