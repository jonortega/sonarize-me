export default function LoginPage() {
  return (
    <main className='min-h-screen bg-black flex flex-col justify-start pt-16 sm:pt-20 md:pt-28 relative overflow-hidden'>
      <div className='absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_#1db954_0%,_#19b950_15%,_#167d3a_25%,_#0f4c24_35%,_#191414_50%,_#000000_100%)] opacity-90'></div>
      <div className='w-full max-w-3xl mx-6 sm:ml-12 md:ml-24 relative z-10'>
        <div className='relative'>
          <div className='absolute -left-1 top-0 w-1 h-24 bg-[#1db954] rounded-full opacity-75'></div>
          <h1 className='text-5xl sm:text-6xl font-extrabold text-white mb-8 sm:mb-12 leading-[1.1] tracking-tight'>
            Descubre tus{" "}
            <span className='relative inline-block'>
              <span className='text-[#1db954] drop-shadow-[0_2px_8px_rgba(29,185,84,0.3)]'>estadísticas</span>
            </span>{" "}
            de{" "}
            <span className='relative inline-block'>
              Spotify
              <div className='absolute -bottom-2 left-0 w-full h-1 bg-[#1db954] rounded-full opacity-75 transform origin-left'></div>
            </span>
          </h1>
        </div>
        <a
          href='/api/auth/login'
          className='group relative inline-flex items-center justify-center px-8 py-3 bg-[#1db954] text-spotify-gray-300 text-base sm:text-lg font-semibold rounded-full overflow-hidden transition-all duration-300 hover:bg-[#1ed760] hover:scale-105 hover:shadow-[0_0_20px_rgba(29,185,84,0.3)]'
        >
          <span className='relative z-10'>Sign In</span>
        </a>
      </div>
    </main>
  );
}
