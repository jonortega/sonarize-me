import { AlertTriangle } from "lucide-react";

const NoFavorites = () => {
  return (
    <div className='w-full h-full flex flex-col items-center justify-center bg-spotify-gray-300 p-6 rounded-lg text-white'>
      <div className='flex items-center space-x-8 w-full'>
        {" "}
        {/* Más espacio entre columnas */}
        {/* Icono más grande */}
        <div className='flex items-center justify-center h-full'>
          <AlertTriangle className='text-spotify-red flex-shrink-0' size={80} /> {/* Icono aún más grande */}
        </div>
        {/* Textos principales */}
        <div className='flex flex-col justify-center text-left'>
          <h2 className='text-lg font-semibold'>
            No puedes ver esta estadística porque no tienes canciones guardadas en favoritos.
          </h2>
          <p className='text-spotify-gray-100 text-sm mt-4'>
            {" "}
            {/* Más espacio entre los textos */}
            Añade algunas canciones y vuelve a intentarlo.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NoFavorites;
