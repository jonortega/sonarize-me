export default function UnderMaintenance() {
  return (
    <main className='min-h-screen bg-black flex flex-col justify-start pt-16 sm:pt-20 md:pt-28 relative overflow-hidden'>
      <div className='absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_#1db954_0%,_#19b950_15%,_#167d3a_25%,_#0f4c24_35%,_#191414_50%,_#000000_100%)] opacity-90'></div>
      <div className='w-full max-w-3xl mx-6 sm:ml-12 md:ml-24 relative z-10'>
        <div className='relative'>
          <div className='absolute -left-1 top-0 w-1 h-24 bg-[#1db954] rounded-full opacity-75'></div>
          <h1 className='text-5xl sm:text-6xl font-extrabold text-white mb-8 sm:mb-12 leading-[1.1] tracking-tight'>
            Estamos en{" "}
            <span className='relative inline-block'>
              <span className='text-[#1db954] drop-shadow-[0_2px_8px_rgba(29,185,84,0.3)]'>mantenimiento</span>
            </span>
          </h1>
        </div>
        <div className='flex items-center space-x-4'>
          <div className='w-8 h-8 bg-[#1db954] rounded-full animate-pulse'></div>
          <p className='text-white text-base sm:text-lg'>Volvemos en breve...</p>
        </div>
      </div>
      <div className='absolute bottom-8 left-6 sm:left-12 md:left-24 text-white text-sm'>Spotify Stats 2025</div>
    </main>
  );
}
