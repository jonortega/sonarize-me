import StatSquare from "@/components/StatSquare";

export default function Stats() {
  return (
    <main className='bg-spotify-black min-h-screen'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        <h1 className='text-4xl md:text-5xl font-bold mb-12 text-center bg-gradient-to-r from-spotify-green to-spotify-blue bg-clip-text text-transparent'>
          Your Spotify Stats
        </h1>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          <StatSquare title='Top Tracks'>
            <p>Discover your most played tracks</p>
          </StatSquare>
          <StatSquare title='Top Artists'>
            <p>See your favorite artists</p>
          </StatSquare>
          <StatSquare title='Listening Time'>
            <p>Track your total listening time</p>
          </StatSquare>
          <StatSquare title='Genre Distribution'>
            <p>Explore your genre preferences</p>
          </StatSquare>
          <StatSquare title='Listening History'>
            <p>View your listening trends over time</p>
          </StatSquare>
          <StatSquare title='Recommendations'>
            <p>Get personalized music recommendations</p>
          </StatSquare>
        </div>
      </div>
    </main>
  );
}
