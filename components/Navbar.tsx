"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import UserActionPanel from "./UserActionPanel";
import { User } from "@/lib/types";
import { ChartColumn } from "lucide-react";

interface NavbarProps {
  user: User;
}

export default function Navbar({ user }: NavbarProps) {
  const pathname = usePathname();

  return (
    <nav className='bg-spotify-black'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-16'>
          <div className='flex-shrink-0'>
            <Link href='/home' className=' flex items-center'>
              <ChartColumn size={24} className='ml-2 text-spotify-green' />
              <span className='ml-2 text-white font-bold text-xl hidden sm:inline'>Spotify Stats</span>
            </Link>
          </div>
          <div className='flex-grow flex justify-center items-baseline space-x-4'>
            <Link
              href='/home'
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                pathname === "/home"
                  ? "bg-spotify-green text-spotify-gray-300"
                  : "text-gray-300 hover:bg-spotify-gray-200 hover:text-white"
              }`}
            >
              Home
            </Link>
            <Link
              href='/stats'
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                pathname === "/stats"
                  ? "bg-spotify-green text-spotify-gray-300"
                  : "text-gray-300 hover:bg-spotify-gray-200 hover:text-white"
              }`}
            >
              Stats
            </Link>
          </div>

          <div className='flex-shrink-0'>
            <UserActionPanel user={user} />
          </div>
        </div>
      </div>
    </nav>
  );
}
