/**
 * @jest-environment node
 */

import { testApiHandler } from "next-test-api-route-handler";
import * as appHandler from "@/app/api/stats/hall-of-fame/route";
import { cookies } from "next/headers";

jest.mock("next/headers", () => ({
  cookies: jest.fn().mockReturnValue({
    get: jest.fn().mockImplementation((name) => {
      if (name === "access_token") {
        return { name: "access_token", value: "mock_access_token" };
      }
      return undefined;
    }),
    getAll: jest.fn().mockReturnValue([]),
    has: jest.fn().mockReturnValue(false),
  }),
}));

describe("API /stats/hall-of-fame (GET)", () => {
  it("debe devolver 401 si no se proporciona el token de acceso", async () => {
    (cookies as jest.MockedFunction<typeof cookies>).mockResolvedValueOnce({
      get: jest.fn().mockReturnValue({ value: "mock_access_token" }),
    });

    await testApiHandler({
      appHandler,
      test: async ({ fetch }) => {
        const res = await fetch();
        expect(res.status).toBe(401);
        await expect(res.json()).resolves.toStrictEqual({
          error: "No access token provided",
        });
      },
    });
  });

  it("debe devolver los 16 tracks más escuchados", async () => {
    (cookies as jest.MockedFunction<typeof cookies>).mockResolvedValueOnce({
      get: jest.fn().mockReturnValue({ value: "mock_access_token" }),
    });

    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        items: Array.from({ length: 16 }).map((_, index) => ({
          name: `Track ${index + 1}`,
          artists: [{ name: `Artist ${index + 1}` }],
          album: { images: [{ url: `https://example.com/album${index + 1}.jpg` }] },
        })),
      }),
    });

    await testApiHandler({
      appHandler,
      test: async ({ fetch }) => {
        const res = await fetch();
        expect(res.status).toBe(200);

        const json = await res.json();
        expect(json.title).toBe("Hall of Fame");
        expect(json.albums).toHaveLength(16);
        json.albums.forEach((album: any, index: number) => {
          expect(album).toMatchObject({
            albumArtUrl: `https://example.com/album${index + 1}.jpg`,
            track: `Track ${index + 1}`,
            artist: `Artist ${index + 1}`,
          });
        });
      },
    });
  });

  it("debe devolver error 500 si la API de Spotify falla", async () => {
    (cookies as jest.MockedFunction<typeof cookies>).mockResolvedValueOnce({
      get: jest.fn().mockReturnValue({ value: "mock_access_token" }),
    });

    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    await testApiHandler({
      appHandler,
      test: async ({ fetch }) => {
        const res = await fetch();
        expect(res.status).toBe(500);
        await expect(res.json()).resolves.toStrictEqual({
          error: "Internal Server Error",
        });
      },
    });
  });
});

describe("API /stats/hall-of-fame (POST)", () => {
  it("debe devolver 401 si no se proporciona el token de acceso", async () => {
    (cookies as jest.MockedFunction<typeof cookies>).mockResolvedValueOnce({
      get: jest.fn().mockReturnValue({ value: "mock_access_token" }),
    });

    await testApiHandler({
      appHandler,
      test: async ({ fetch }) => {
        const res = await fetch({ method: "POST" });
        expect(res.status).toBe(401);
        await expect(res.json()).resolves.toStrictEqual({
          error: "No access token provided",
        });
      },
    });
  });

  it("debe crear correctamente la playlist en Spotify", async () => {
    (cookies as jest.MockedFunction<typeof cookies>).mockResolvedValueOnce({
      get: jest.fn().mockReturnValue({ value: "mock_access_token" }),
    });

    global.fetch = jest
      .fn()
      // Simula obtener las canciones más escuchadas
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          items: Array.from({ length: 16 }).map((_, index) => ({
            uri: `spotify:track:track${index + 1}`,
            name: `Track ${index + 1}`,
            artists: [{ name: `Artist ${index + 1}` }],
            album: { images: [{ url: `https://example.com/album${index + 1}.jpg` }] },
          })),
        }),
      })
      // Simula obtener la información del usuario
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          id: "mock_user_id",
        }),
      })
      // Simula la creación de la playlist
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          id: "mock_playlist_id",
        }),
      })
      // Simula la adición de las canciones a la playlist
      .mockResolvedValueOnce({
        ok: true,
      })
      // Simula la actualización de la imagen de la playlist
      .mockResolvedValueOnce({
        ok: true,
      });

    await testApiHandler({
      appHandler,
      requestPatcher: (req) => {
        req.headers.append("Content-Type", "application/json");
      },
      test: async ({ fetch }) => {
        const res = await fetch({
          method: "POST",
          body: JSON.stringify({ coverImage: "mock_image_data" }),
        });

        expect(res.status).toBe(200);
        await expect(res.json()).resolves.toStrictEqual({
          success: true,
          playlistId: "mock_playlist_id",
        });
      },
    });
  });

  it("debe devolver error 500 si la API de Spotify falla en cualquier paso", async () => {
    (cookies as jest.MockedFunction<typeof cookies>).mockResolvedValueOnce({
      get: jest.fn().mockReturnValue({ value: "mock_access_token" }),
    });

    global.fetch = jest
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          items: Array.from({ length: 16 }).map((_, index) => ({
            uri: `spotify:track:track${index + 1}`,
          })),
        }),
      })
      .mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

    await testApiHandler({
      appHandler,
      requestPatcher: (req) => {
        req.headers.append("Content-Type", "application/json");
      },
      test: async ({ fetch }) => {
        const res = await fetch({
          method: "POST",
          body: JSON.stringify({ coverImage: "mock_image_data" }),
        });

        expect(res.status).toBe(500);
        await expect(res.json()).resolves.toStrictEqual({
          error: "Internal Server Error",
        });
      },
    });
  });
});
