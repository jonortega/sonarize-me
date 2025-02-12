/**
 * @jest-environment node
 */

import { testApiHandler } from "next-test-api-route-handler";
import * as appHandler from "@/app/api/stats/tus-decadas/route";
import { cookies } from "next/headers";

jest.mock("next/headers", () => ({
  cookies: jest.fn().mockResolvedValue({
    get: jest.fn().mockReturnValue(undefined), // Simula que no hay access_token
  }),
}));

describe("API /stats/tus-decadas (GET)", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

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
          error: "No access token found",
        });
      },
    });
  });

  it("debe devolver los tracks correctamente agrupados por década", async () => {
    (cookies as jest.MockedFunction<typeof cookies>).mockReturnValue({
      get: jest.fn().mockReturnValue({ value: "mock_access_token" }),
    });

    global.fetch = jest.fn().mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          items: [
            {
              track: {
                album: {
                  id: "album1",
                  images: [{ url: "https://example.com/album1.jpg", width: 300, height: 300 }],
                  release_date: "1995-06-15",
                  release_date_precision: "year",
                },
              },
            },
            {
              track: {
                album: {
                  id: "album2",
                  images: [{ url: "https://example.com/album2.jpg", width: 300, height: 300 }],
                  release_date: "2003-09-20",
                  release_date_precision: "year",
                },
              },
            },
            {
              track: {
                album: {
                  id: "album3",
                  images: [{ url: "https://example.com/album3.jpg", width: 300, height: 300 }],
                  release_date: "2018-01-10",
                  release_date_precision: "year",
                },
              },
            },
          ],
          next: null,
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      )
    );

    await testApiHandler({
      appHandler,
      test: async ({ fetch }) => {
        const res = await fetch();
        expect(res.status).toBe(200);

        const json = await res.json();
        expect(json).toMatchObject({
          1995: [{ id: "album1", albumPicUrl: "https://example.com/album1.jpg", year: 1995 }],
          2003: [{ id: "album2", albumPicUrl: "https://example.com/album2.jpg", year: 2003 }],
          2018: [{ id: "album3", albumPicUrl: "https://example.com/album3.jpg", year: 2018 }],
        });
      },
    });
  });

  it("debe manejar correctamente cuando no hay canciones guardadas", async () => {
    (cookies as jest.MockedFunction<typeof cookies>).mockReturnValue({
      get: jest.fn().mockReturnValue({ value: "mock_access_token" }),
    });

    global.fetch = jest.fn().mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          items: [],
          next: null,
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      )
    );

    await testApiHandler({
      appHandler,
      test: async ({ fetch }) => {
        const res = await fetch();
        expect(res.status).toBe(200);

        const json = await res.json();
        expect(json).toEqual({});
      },
    });
  });

  it("debe devolver error 500 si la API de Spotify falla", async () => {
    (cookies as jest.MockedFunction<typeof cookies>).mockReturnValue({
      get: jest.fn().mockReturnValue({ value: "mock_access_token" }),
    });

    global.fetch = jest.fn().mockResolvedValueOnce(new Response(null, { status: 500 }));

    await testApiHandler({
      appHandler,
      test: async ({ fetch }) => {
        const res = await fetch();
        expect(res.status).toBe(500);
        await expect(res.json()).resolves.toStrictEqual({
          error: "Failed to fetch tracks",
        });
      },
    });
  });
});
