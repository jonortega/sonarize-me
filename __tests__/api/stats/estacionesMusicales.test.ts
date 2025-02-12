/**
 * @jest-environment node
 */

import { testApiHandler } from "next-test-api-route-handler";
import * as appHandler from "@/app/api/stats/estaciones-musicales/route";
import { RequestCookies } from "next/dist/compiled/@edge-runtime/cookies";
import { cookies } from "next/headers";
import axios from "axios";

jest.mock("axios");
jest.mock("next/headers", () => ({
  cookies: jest.fn(),
}));

describe("API /stats/estaciones-musicales", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it("debe devolver 401 si no se proporciona el token de acceso", async () => {
    (cookies as jest.MockedFunction<typeof cookies>).mockReturnValue(new RequestCookies(new Headers({})));

    await testApiHandler({
      appHandler,
      test: async ({ fetch }) => {
        const res = await fetch();
        expect(res.status).toBe(401);
        await expect(res.json()).resolves.toStrictEqual({
          error: "No access token provided in cookies",
        });
      },
    });
  });

  it("debe devolver artistas y géneros destacados por estación", async () => {
    (cookies as jest.MockedFunction<typeof cookies>).mockReturnValue(
      new RequestCookies(new Headers({ Cookie: "access_token=mock_access_token" }))
    );

    (axios.get as jest.MockedFunction<typeof axios.get>)
      // Simula la API de Spotify para obtener tracks guardados
      .mockResolvedValueOnce({
        data: {
          items: [
            {
              added_at: "2024-03-21T10:15:00Z", // Primavera
              track: {
                name: "Spring Song",
                artists: [{ id: "artist1", name: "Artist Primavera" }],
                album: { images: [{ url: "https://example.com/spring.jpg" }] },
              },
            },
            {
              added_at: "2024-06-21T14:30:00Z", // Verano
              track: {
                name: "Summer Song",
                artists: [{ id: "artist2", name: "Artist Verano" }],
                album: { images: [{ url: "https://example.com/summer.jpg" }] },
              },
            },
          ],
          next: null,
        },
      })
      // Simula la API de Spotify para obtener datos de los artistas
      .mockResolvedValueOnce({
        data: {
          artists: [
            {
              id: "artist1",
              name: "Artist Primavera",
              genres: ["Rock"],
              images: [{ url: "https://example.com/artist1.jpg" }],
            },
            {
              id: "artist2",
              name: "Artist Verano",
              genres: ["Pop"],
              images: [{ url: "https://example.com/artist2.jpg" }],
            },
          ],
        },
      });

    await testApiHandler({
      appHandler,
      test: async ({ fetch }) => {
        const res = await fetch();
        expect(res.status).toBe(200);

        const json = await res.json();
        expect(json).toMatchObject({
          primavera: {
            artist: { name: "Artist Primavera", artistPicUrl: "https://example.com/artist1.jpg" },
            genre: { name: "Rock" },
          },
          verano: {
            artist: { name: "Artist Verano", artistPicUrl: "https://example.com/artist2.jpg" },
            genre: { name: "Pop" },
          },
        });
      },
    });
  });

  it("debe manejar correctamente la paginación de la API de Spotify", async () => {
    (cookies as jest.MockedFunction<typeof cookies>).mockReturnValue(
      new RequestCookies(new Headers({ Cookie: "access_token=mock_access_token" }))
    );

    (axios.get as jest.MockedFunction<typeof axios.get>)
      // Simula la API de Spotify con paginación
      .mockResolvedValueOnce({
        data: {
          items: [
            {
              added_at: "2024-12-22T09:00:00Z", // Invierno
              track: { name: "Winter Song", artists: [{ id: "artist3", name: "Artist Invierno" }] },
            },
          ],
          next: "https://api.spotify.com/v1/me/tracks?offset=50",
        },
      })
      .mockResolvedValueOnce({
        data: {
          items: [
            {
              added_at: "2024-09-24T11:30:00Z", // Otoño
              track: { name: "Autumn Song", artists: [{ id: "artist4", name: "Artist Otoño" }] },
            },
          ],
          next: null,
        },
      })
      // Simula la API de Spotify para obtener datos de los artistas
      .mockResolvedValueOnce({
        data: {
          artists: [
            {
              id: "artist3",
              name: "Artist Invierno",
              genres: ["Jazz"],
              images: [{ url: "https://example.com/artist3.jpg" }],
            },
            {
              id: "artist4",
              name: "Artist Otoño",
              genres: ["Blues"],
              images: [{ url: "https://example.com/artist4.jpg" }],
            },
          ],
        },
      });

    await testApiHandler({
      appHandler,
      test: async ({ fetch }) => {
        const res = await fetch();
        expect(res.status).toBe(200);

        const json = await res.json();
        expect(json.invierno).toMatchObject({
          artist: { name: "Artist Invierno", artistPicUrl: "https://example.com/artist3.jpg" },
          genre: { name: "Jazz" },
        });
        expect(json.otono).toMatchObject({
          artist: { name: "Artist Otoño", artistPicUrl: "https://example.com/artist4.jpg" },
          genre: { name: "Blues" },
        });
      },
    });
  });

  it("debe devolver error 500 si la API de Spotify falla", async () => {
    (cookies as jest.MockedFunction<typeof cookies>).mockReturnValue(
      new RequestCookies(new Headers({ Cookie: "access_token=mock_access_token" }))
    );

    (axios.get as jest.MockedFunction<typeof axios.get>).mockRejectedValueOnce(new Error("API Error"));

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
