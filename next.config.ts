import type { NextConfig } from "next";

// * ELIMINAR CUANDO IMPLEMENTE LAS LLAMADAS A LA API DE SPOTIFY

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
        port: "",
        pathname: "/300", // Permite el acceso a la ruta base
      },
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
        port: "",
        pathname: "/300?img=*", // Permite imágenes con parámetros como "?img=1"
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
        port: "",
        pathname: "/**", // Permite cualquier ruta bajo picsum.photos
      },
      // ! Este sí que hay que dejarlo aquí
      {
        protocol: "https",
        hostname: "i.scdn.co", // Spotify domain
        port: "",
        pathname: "/**", // Permite cualquier ruta bajo i.scdn.co
      },
    ],
  },
};

export default nextConfig;
