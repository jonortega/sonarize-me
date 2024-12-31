import Image from "next/image";
import { Track } from "@/lib/types";
import { Music } from "lucide-react";

export default function TopTracks({ tracks }: { tracks: Track[] }) {
  return (
    <div className='bg-spotify-black bg-opacity-30 p-4 rounded-lg'>
      <h2 className='text-2xl font-bold mb-4 flex items-center'>
        <Music className='mr-2 text-spotify-green' />
        Top Tracks
      </h2>
      <ul className='space-y-4'>
        {tracks.map((track) => (
          <li key={track.id} className='flex items-center space-x-3'>
            <Image src={track.albumArtUrl} alt={track.name} width={50} height={50} className='rounded' />
            <div>
              <p className='font-semibold'>{track.name}</p>
              <p className='text-sm text-gray-400'>{track.artist}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
