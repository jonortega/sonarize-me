/**
 * @jest-environment node
 */

import { testApiHandler } from "next-test-api-route-handler";
import * as appHandler from "@/app/api/stats/indice-de-interferencia/route";
import { cookies } from "next/headers";

jest.mock("next/headers", () => ({
  cookies: jest.fn().mockReturnValue({
    get: jest.fn().mockReturnValue(undefined), // Simula que no hay access_token
  }),
}));

global.fetch = jest.fn().mockImplementation((url) => {
  if (url.includes("me/tracks?limit=1")) {
    return Promise.resolve({
      ok: true,
      json: async () => ({
        total: 3,
        items: [],
        next: null,
      }),
    });
  }

  if (url.includes("me/tracks?limit=50")) {
    return Promise.resolve({
      ok: true,
      json: async () => ({
        total: 3,
        items: [{ track: { popularity: 80 } }, { track: { popularity: 60 } }, { track: { popularity: 40 } }],
        next: null,
      }),
    });
  }

  if (url.includes("me/player/recently-played")) {
    return Promise.resolve({
      ok: true,
      json: async () => ({
        items: [{ track: { popularity: 50 } }, { track: { popularity: 70 } }],
      }),
    });
  }

  return Promise.resolve({ ok: false, status: 500 });
});

describe("API /stats/indice-de-interferencia (GET)", () => {
  it("debe devolver 401 si no se proporciona el token de acceso", async () => {
    (cookies as jest.MockedFunction<typeof cookies>).mockReturnValue({
      get: jest.fn().mockReturnValue(undefined),
    });

    await testApiHandler({
      appHandler,
      test: async ({ fetch }) => {
        const res = await fetch();
        expect(res.status).toBe(401);
        await expect(res.json()).resolves.toStrictEqual({
          error: "Access token not found",
        });
      },
    });
  });

  it("debe calcular correctamente los valores de 'normal' y 'actual'", async () => {
    (cookies as jest.MockedFunction<typeof cookies>).mockReturnValue({
      get: jest.fn().mockReturnValue({ value: "mock_access_token" }),
    });

    global.fetch = jest.fn().mockImplementation(async (url) => {
      if (url.includes("/me/tracks?limit=1")) {
        return { ok: true, json: async () => ({ total: 3 }) };
      }
      if (url.includes("/me/tracks")) {
        return {
          ok: true,
          json: async () => ({
            items: [{ track: { popularity: 80 } }, { track: { popularity: 60 } }, { track: { popularity: 40 } }],
            next: null,
          }),
        };
      }
      if (url.includes("/me/player/recently-played")) {
        return {
          ok: true,
          json: async () => ({
            items: [{ track: { popularity: 50 } }, { track: { popularity: 70 } }],
          }),
        };
      }
      return { ok: false, status: 500 };
    });

    await testApiHandler({
      appHandler,
      test: async ({ fetch }) => {
        const res = await fetch();
        expect(res.status).toBe(200);

        const json = await res.json();
        expect(json).toMatchObject({ normal: 60, actual: 60 });
      },
    });
  });

  it("debe manejar correctamente cuando no hay canciones guardadas", async () => {
    (cookies as jest.MockedFunction<typeof cookies>).mockReturnValue({
      get: jest.fn().mockReturnValue({ value: "mock_access_token" }),
    });

    global.fetch = jest.fn().mockImplementation(async (url) => {
      if (url.includes("/me/tracks?limit=1")) {
        return { ok: true, json: async () => ({ total: 0 }) };
      }
      if (url.includes("/me/player/recently-played")) {
        return {
          ok: true,
          json: async () => ({
            items: [{ track: { popularity: 50 } }, { track: { popularity: 70 } }],
          }),
        };
      }
      return { ok: false, status: 500 };
    });

    await testApiHandler({
      appHandler,
      test: async ({ fetch }) => {
        const res = await fetch();
        expect(res.status).toBe(200);

        const json = await res.json();
        expect(json).toMatchObject({ normal: -1, actual: 60 });
      },
    });
  });

  it("debe manejar correctamente cuando no hay canciones recientes reproducidas", async () => {
    (cookies as jest.MockedFunction<typeof cookies>).mockReturnValue({
      get: jest.fn().mockReturnValue({ value: "mock_access_token" }),
    });

    global.fetch = jest.fn().mockImplementation(async (url) => {
      if (url.includes("/me/tracks?limit=1")) {
        return { ok: true, json: async () => ({ total: 3 }) };
      }
      if (url.includes("/me/tracks")) {
        return {
          ok: true,
          json: async () => ({
            items: [{ track: { popularity: 80 } }, { track: { popularity: 60 } }, { track: { popularity: 40 } }],
            next: null,
          }),
        };
      }
      if (url.includes("/me/player/recently-played")) {
        return { ok: true, json: async () => ({ items: [] }) };
      }
      return { ok: false, status: 500 };
    });

    await testApiHandler({
      appHandler,
      test: async ({ fetch }) => {
        const res = await fetch();
        expect(res.status).toBe(200);

        const json = await res.json();
        expect(json).toMatchObject({ normal: 60, actual: 0 });
      },
    });
  });

  it("debe devolver error 500 si la API de Spotify falla", async () => {
    (cookies as jest.MockedFunction<typeof cookies>).mockReturnValue({
      get: jest.fn().mockReturnValue({ value: "mock_access_token" }),
    });

    global.fetch = jest.fn().mockResolvedValueOnce({ ok: false, status: 500 });

    await testApiHandler({
      appHandler,
      test: async ({ fetch }) => {
        const res = await fetch();
        expect(res.status).toBe(500);
        await expect(res.json()).resolves.toStrictEqual({
          error: "Failed to fetch Spotify data",
        });
      },
    });
  });
});
