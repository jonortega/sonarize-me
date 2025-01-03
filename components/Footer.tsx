import Link from "next/link";
import { Github, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className='bg-spotify-black text-spotify-gray-100 py-6 border-t border-spotify-gray-200'>
      <div className='max-w-5xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex flex-col md:flex-row justify-between items-center'>
          <div className='mb-4 md:mb-0'>
            <p className='text-sm'>Spotify Stats 2025</p>
          </div>
          <div className='flex space-x-4'>
            <Link href='https://github.com/yourusername' className='text-white hover:text-spotify-green'>
              <Github size={24} />
            </Link>
            <Link href='https://linkedin.com/in/yourusername' className='text-white hover:text-spotify-green'>
              <Linkedin size={24} />
            </Link>
          </div>
        </div>
        <div className='mt-4 text-center text-xs'>
          <Link href='#' className='hover:text-spotify-green mr-4'>
            About
          </Link>
          <Link href='#' className='hover:text-spotify-green mr-4'>
            Privacy Policy
          </Link>
          <Link href='#' className='hover:text-spotify-green'>
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}
