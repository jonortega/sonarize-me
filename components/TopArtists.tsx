import Image from "next/image";
import { Artist } from "@/lib/types";
import { Users } from "lucide-react";

export default function TopArtists({ artists }: { artists: Artist[] }) {
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
            <Image src={artist.imageUrl} alt={artist.name} width={50} height={50} className='rounded-full' />
            <p className='font-semibold truncate flex-grow min-w-0'>{artist.name}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
