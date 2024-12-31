import Image from "next/image";
import { User } from "@/lib/types";

export default function UserProfile({ user }: { user: User }) {
  return (
    <div className='flex items-center space-x-4 bg-spotify-green bg-opacity-10 p-4 rounded-lg'>
      <Image src={user.imageUrl} alt={user.name} width={80} height={80} className='rounded-full' />
      <div>
        <h2 className='text-2xl font-bold'>{user.name}</h2>
        <p className='text-gray-300'>{user.email}</p>
      </div>
    </div>
  );
}
