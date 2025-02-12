/**
 * @jest-environment node
 */

import { testApiHandler } from "next-test-api-route-handler"; // 🔹 Debe ser el primer import
import * as appHandler from "@/app/api/auth/callback/route";
// import axios from "axios";

// Mock de axios para evitar hacer llamadas reales a Spotify
jest.mock("axios");
// const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("API /auth/callback", () => {
  it("debe redirigir con error si faltan los parámetros code y state", async () => {
    await testApiHandler({
      appHandler,
      url: "/api/auth/callback",
      test: async ({ fetch }) => {
        const res = await fetch();
        expect(res.status).toBe(307);
        expect(res.headers.get("location")).toContain("/?error=missing_params");
      },
    });
  });

  it("debe redirigir con error si el estado no coincide con la cookie", async () => {
    await testApiHandler({
      appHandler,
      url: "/api/auth/callback?code=valid_code&state=wrong_state",
      requestPatcher: (req) => {
        req.headers.set("Cookie", "spotify_auth_state=correct_state");
      },
      test: async ({ fetch }) => {
        const res = await fetch();
        expect(res.status).toBe(307);
        expect(res.headers.get("location")).toContain("/?error=state_mismatch");
      },
    });
  });

  //   it("debe intercambiar el código por un access_token y almacenar cookies correctamente", async () => {
  //     mockedAxios.post.mockResolvedValue({
  //       data: {
  //         access_token: "mock_access_token",
  //         refresh_token: "mock_refresh_token",
  //         expires_in: 3600,
  //       },
  //     });

  //     await testApiHandler({
  //       appHandler,
  //       url: "/api/auth/callback?code=valid_code&state=correct_state",
  //       requestPatcher: (req) => {
  //         req.headers.append("cookie", "spotify_auth_state=correct_state"); // ✅ Usa append en vez de set
  //       },
  //       test: async ({ fetch }) => {
  //         const res = await fetch();
  //         expect(res.status).toBe(307);
  //         expect(res.headers.get("location")).toContain("/home");

  //         // Verificar cookies
  //         const setCookieHeader = res.headers.get("set-cookie");
  //         expect(setCookieHeader).toContain("access_token=mock_access_token");
  //         expect(setCookieHeader).toContain("refresh_token=mock_refresh_token");
  //         expect(setCookieHeader).toContain("HttpOnly");
  //         expect(setCookieHeader).toContain("Path=/");
  //       },
  //     });
  //   });

  //   it("debe redirigir con error si la API de Spotify falla", async () => {
  //     mockedAxios.post.mockRejectedValue(new Error("Spotify API error"));

  //     await testApiHandler({
  //       appHandler,
  //       url: "/api/auth/callback?code=valid_code&state=correct_state",
  //       requestPatcher: (req) => {
  //         req.headers.append("cookie", "spotify_auth_state=correct_state"); // ✅ Usa append en vez de set
  //       },
  //       test: async ({ fetch }) => {
  //         const res = await fetch();
  //         expect(res.status).toBe(307);
  //         expect(res.headers.get("location")).toContain("/?error=token_exchange_failed");
  //       },
  //     });
  //   });
});
