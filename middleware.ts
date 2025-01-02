import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// ! No comprueba si el access_token es válido, solo si existe
// ! Si se quiere comprobar en cada petición,
// ! se complica y se realentiza la web.
// ! Se puede solucionar con un cache de tokens en el servidor.
// ! Es un punto a mejorar en el futuro.
export async function middleware(req: NextRequest) {
  const accessToken = req.cookies.get("access_token");

  // Si no hay un token de acceso, redirige al login
  if (!accessToken) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

// Configura las rutas protegidas
export const config = {
  matcher: ["/home/:path*", "/stats/:path*"], // Agrega aquí todas las rutas que quieres proteger
};
