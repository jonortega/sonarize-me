"use client";

import { useState } from "react";
import Image from "next/image";
import { User } from "@/lib/types";
import { LogOut, Settings, UserIcon } from "lucide-react";

interface UserActionPanelProps {
  user: User;
}

export default function UserActionPanel({ user }: UserActionPanelProps) {
  const [isOpen, setIsOpen] = useState(false);

  const togglePanel = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    // TODO: Implement logout functionality
    console.log("Logout clicked");
  };

  return (
    <div className='relative'>
      <button
        onClick={togglePanel}
        className='rounded-full overflow-hidden focus:outline-none focus:ring-2 focus:ring-spotify-green'
      >
        {user.imageUrl ? (
          <Image src={user.imageUrl} alt={user.name} width={40} height={40} className='rounded-full' />
        ) : (
          <div className='w-10 h-10 bg-spotify-green rounded-full flex items-center justify-center'>
            <UserIcon className='text-spotify-black' size={24} />
          </div>
        )}
      </button>
      {isOpen && (
        <div className='absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-spotify-black border border-gray-700'>
          <div className='py-1'>
            <button
              onClick={() => console.log("Settings clicked")}
              className='block w-full text-left px-4 py-2 text-sm text-spotify-white hover:bg-gray-800'
            >
              <Settings className='inline-block mr-2' size={16} />
              Settings
            </button>
            <button
              onClick={handleLogout}
              className='block w-full text-left px-4 py-2 text-sm text-spotify-white hover:bg-gray-800'
            >
              <LogOut className='inline-block mr-2' size={16} />
              Log out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
