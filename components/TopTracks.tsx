import { cookies } from "next/headers";
import Image from "next/image";
import { Music } from "lucide-react";
import { fetchTopTracks } from "@/lib/fetchTopTracks";
import { Track } from "@/lib/types";

export default async function TopTracks({ timeRange = "short_term" }: { timeRange?: string }) {
  const cookieStore = cookies();
  const access_token = (await cookieStore).get("access_token")?.value || "";

  const tracks: Track[] = await fetchTopTracks(timeRange, access_token);

  return (
    <div className='bg-spotify-gray-300 p-4 rounded-lg border-2 border-spotify-gray-200 h-full'>
      <h2 className='text-2xl font-bold mb-4 flex items-center'>
        <Music className='mr-2 text-spotify-green' />
        Top Tracks
      </h2>
      <ul className='space-y-4'>
        {tracks.map((track, index) => (
          <li key={track.id} className='flex items-center space-x-3'>
            <span className='text-spotify-green font-bold min-w-[24px]'>#{index + 1}</span>
            <Image src={track.albumArtUrl} alt={track.name} width={50} height={50} className='rounded' />
            <div className='flex-grow min-w-0'>
              <p className='font-semibold truncate'>{track.name}</p>
              <p className='text-sm text-gray-400 truncate'>{track.artist}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
