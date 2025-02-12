import { AlertTriangle } from "lucide-react";

const NoFavorites = () => {
  return (
    <div className='w-full h-full flex items-center justify-center bg-spotify-black p-6 rounded-lg text-white'>
      <div className='flex items-center space-x-8 max-w-xl'>
        {/* Icono más grande */}
        <div className='flex items-center justify-center h-full'>
          <AlertTriangle data-testid='warning-icon' className='text-spotify-red flex-shrink-0' size={110} />
        </div>
        {/* Textos principales */}
        <div className='flex flex-col justify-center text-left'>
          <h2 className='text-xl font-semibold'>
            No puedes ver esta estadística porque no tienes canciones guardadas en favoritos.
          </h2>
          <p className='text-spotify-gray-100 text-base mt-4'>Añade algunas canciones y vuelve a intentarlo.</p>
        </div>
      </div>
    </div>
  );
};

export default NoFavorites;
