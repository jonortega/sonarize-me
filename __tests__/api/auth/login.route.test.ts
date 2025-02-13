/**
 * @jest-environment node
 */

import { config } from "dotenv";

// Cargar primero `.env.local` si existe
config({ path: ".env.local" });
// Si `.env.local` no está presente, carga `.env.test` como fallback
config({ path: ".env.test" });

import { testApiHandler } from "next-test-api-route-handler"; // Debe ser el primer import
import * as appHandler from "@/app/api/auth/login/route"; // Importa el módulo completo

describe("API /auth/login", () => {
  it("debe redirigir a la página de autenticación de Spotify con los parámetros correctos", async () => {
    await testApiHandler({
      appHandler,
      test: async ({ fetch }) => {
        const res = await fetch(); // Simula la petición GET al endpoint

        expect(res.status).toBe(307); // 307 = Redirect
        const location = res.headers.get("location");
        expect(location).toBeDefined();
        expect(location).toContain("https://accounts.spotify.com/authorize?");
        expect(location).toContain("response_type=code");
        expect(location).toContain(`client_id=${process.env.SPOTIFY_CLIENT_ID}`);
        expect(location).toContain(`redirect_uri=${encodeURIComponent(process.env.SPOTIFY_REDIRECT_URI!)}`);
        expect(location).toContain("state=");
      },
    });
  });

  it("debe establecer la cookie spotify_auth_state correctamente", async () => {
    await testApiHandler({
      appHandler,
      test: async ({ fetch }) => {
        const res = await fetch();

        // Obtener la cabecera Set-Cookie manualmente
        const setCookieHeader = res.headers.get("set-cookie");

        expect(setCookieHeader).toBeDefined();
        expect(setCookieHeader).toContain("spotify_auth_state="); // Verifica que la cookie está presente
        expect(setCookieHeader).toContain("HttpOnly");
        expect(setCookieHeader).toContain("Path=/");
        expect(setCookieHeader).toContain("Max-Age=300");
      },
    });
  });

  it("debe generar un state aleatorio en cada llamada", async () => {
    await testApiHandler({
      appHandler,
      test: async ({ fetch }) => {
        const res1 = await fetch();
        const state1 = res1.headers.get("location")?.match(/state=([a-zA-Z0-9]+)/)?.[1];

        const res2 = await fetch();
        const state2 = res2.headers.get("location")?.match(/state=([a-zA-Z0-9]+)/)?.[1];

        expect(state1).toBeDefined();
        expect(state2).toBeDefined();
        expect(state1).not.toEqual(state2); // Se espera que el CSRF state sea aleatorio
      },
    });
  });

  it("debe generar un state válido en formato hex", async () => {
    await testApiHandler({
      appHandler,
      test: async ({ fetch }) => {
        const res = await fetch();
        const state = res.headers.get("location")?.match(/state=([a-f0-9]+)/)?.[1];

        expect(state).toBeDefined();
        expect(state).toMatch(/^[a-f0-9]{32}$/); // 16 bytes → 32 caracteres hexadecimales
      },
    });
  });
});
