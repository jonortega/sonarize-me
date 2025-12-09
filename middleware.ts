import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { renovarAccessToken } from "@/lib/spotify";

// ! No comprueba si el access_token es válido, solo si existe
// ! Si se quiere comprobar en cada petición,
// ! se complica y se realentiza la web.
// ! Se puede solucionar con un cache de tokens en el servidor.
// ! Es un punto a mejorar en el futuro.
export async function middleware(req: NextRequest) {
  const demo_mode = req.cookies.get("demo_mode");
  const access_token = req.cookies.get("access_token");
  const refresh_token = req.cookies.get("refresh_token");

  // Caso 0: Si estamos en modo demo, dejamos pasar directamente
  if (demo_mode?.value === "true") {
    console.log("Modo demo detectado, permitiendo acceso...");
    return NextResponse.next();
  }

  // Caso 1: Si no hay ni access_token ni refresh_token, redirigimos al login
  if (!access_token && !refresh_token) {
    console.log("No hay tokens, redirigiendo al login...");
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Caso 2: Si hay un refresh_token pero no un access_token, renovamos el token
  if (!access_token && refresh_token) {
    console.log("No hay access_token, renovando...");
    const new_tokens = await renovarAccessToken(refresh_token.value);

    if (!new_tokens) {
      // Si no podemos renovar el token, redirigimos al login
      return NextResponse.redirect(new URL("/", req.url));
    }

    // Actualizamos las cookies con los nuevos tokens
    const res = NextResponse.next();

    res.cookies.set("access_token", new_tokens.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: new_tokens.expires_in, // 1 hora
    });

    if (new_tokens.refresh_token) {
      res.cookies.set("refresh_token", new_tokens.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24, // 1 día
      });
    }

    return res; // Permitimos que la request continúe con el nuevo token
  }

  // Caso 3: Si hay un access_token, dejamos que la petición continúe
  return NextResponse.next();
}

// Configura las rutas protegidas
export const config = {
  matcher: ["/home/:path*", "/stats/:path*"],
};
