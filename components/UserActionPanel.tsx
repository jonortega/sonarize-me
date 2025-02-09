"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { User } from "@/lib/types";
import { LogOut, UserIcon } from "lucide-react";

interface UserActionPanelProps {
  user: User;
}

export default function UserActionPanel({ user }: UserActionPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const togglePanel = () => setIsOpen(!isOpen);

  const handleClickOutside = (event: MouseEvent) => {
    if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout");

      if (!response.ok) {
        throw new Error("Error al hacer logout");
      }

      console.log("Usuario deslogueado correctamente");
      router.push("/");
    } catch (error) {
      console.error("Error al hacer logout:", error);
    }
  };

  return (
    <div className='relative' ref={panelRef}>
      <button
        onClick={togglePanel}
        className={`rounded-full overflow-hidden focus:outline-none ${isOpen ? "ring-2 ring-spotify-green" : ""}`}
      >
        {user.imageUrl ? (
          <Image src={user.imageUrl} alt={user.name} width={42} height={42} className='rounded-full' />
        ) : (
          <div className='w-10 h-10 bg-spotify-green rounded-full flex items-center justify-center'>
            <UserIcon className='text-spotify-black' size={24} />
          </div>
        )}
      </button>
      {isOpen && (
        <div className='absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-spotify-black border border-gray-700 z-10'>
          {/* Texto de usuario */}
          <div className='py-2 px-4 border-b border-gray-600 text-left'>
            <p className='text-xs text-spotify-gray-100 font-medium'>Cuenta:</p>
            <p className='text-sm text-spotify-white font-semibold truncate'>{user.name}</p>
          </div>

          {/* Botón de logout */}
          <div className='py-1'>
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
