import Image from "next/image";
import { User } from "@/lib/types";

export default function UserProfile({ user }: { user: User }) {
  return (
    <div className='flex items-center justify-center space-x-4 bg-spotify-gray-300 p-6 rounded-lg border-2 border-spotify-gray-200 max-w-sm mx-auto shadow-lg'>
      <Image src={user.imageUrl} alt={user.name} width={80} height={80} className='rounded-full mb-4' />
      <div>
        <h2 className='text-2xl font-bold text-spotify-white mb-1 text-center truncate w-full'>{user.name}</h2>
        <p className='text-spotify-gray-100 text-center truncate w-full'>{user.email}</p>
      </div>
    </div>
  );
}
