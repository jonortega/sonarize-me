import StatSquare from "@/components/StatSquare";
import { Music, Users, Clock, PieChart, BarChart2, Radio } from "lucide-react";

export default function Stats() {
  return (
    <main className='bg-spotify-black min-h-screen'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        <h1 className='text-4xl md:text-5xl font-bold mb-12 text-center bg-gradient-to-r from-spotify-green to-spotify-blue bg-clip-text text-transparent'>
          Your Spotify Stats
        </h1>
        <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6'>
          <StatSquare title='Top Tracks' icon={Music} className='md:col-span-2 lg:col-span-2 lg:row-span-2'>
            <p className='mb-4'>Discover your most played tracks and see how your music taste evolves over time.</p>
            <div className='bg-spotify-gray-200 p-4 rounded-lg'>
              <p className='font-semibold'>1. Shape of You - Ed Sheeran</p>
              <p className='font-semibold'>2. Blinding Lights - The Weeknd</p>
              <p className='font-semibold'>3. Dance Monkey - Tones and I</p>
            </div>
          </StatSquare>
          <StatSquare title='Top Artists' icon={Users} className='md:col-span-1 lg:col-span-2'>
            <p>Explore your favorite artists and their impact on your listening habits.</p>
          </StatSquare>
          <StatSquare title='Listening Time' icon={Clock}>
            <p>Track your total listening time and see how it changes day by day.</p>
          </StatSquare>
          <StatSquare title='Genre Distribution' icon={PieChart}>
            <p>Visualize your genre preferences with an interactive chart.</p>
          </StatSquare>
          <StatSquare title='Listening History' icon={BarChart2} className='md:col-span-2 lg:col-span-2'>
            <p>View your listening trends over time and discover patterns in your music consumption.</p>
          </StatSquare>
          <StatSquare title='Recommendations' icon={Radio}>
            <p>Get personalized music recommendations based on your listening history.</p>
          </StatSquare>
        </div>
      </div>
    </main>
  );
}
