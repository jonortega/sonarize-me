import { cookies } from "next/headers";
import Image from "next/image";
import { Users } from "lucide-react";
import { Artist } from "@/lib/types";
import { fetchTopArtists } from "@/lib/fetchTopArtists";

export default async function TopArtists({ timeRange = "short_term" }: { timeRange?: string }) {
  const cookieStore = cookies();
  const access_token = (await cookieStore).get("access_token")?.value || "";

  const artists: Artist[] = await fetchTopArtists(timeRange, access_token);

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
