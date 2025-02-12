/**
 * @jest-environment node
 */

import { testApiHandler } from "next-test-api-route-handler";
import * as appHandler from "@/app/api/home/recently-played/route";
import axios from "axios";
import { cookies } from "next/headers";

jest.mock("axios");
jest.mock("next/headers", () => ({
  cookies: jest.fn().mockReturnValue({
    get: jest.fn().mockResolvedValue(undefined),
  }),
}));

const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockedCookies = cookies as jest.MockedFunction<typeof cookies>;

describe("API /home/recently-played", () => {
  it("debe devolver 401 si no se proporciona el token de acceso", async () => {
    mockedCookies.mockReturnValue({
      get: jest.fn().mockReturnValue(undefined),
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

  it("debe obtener correctamente las canciones recientemente reproducidas", async () => {
    mockedCookies.mockReturnValue({
      get: jest.fn().mockReturnValue({ value: "mock_access_token" }),
    });

    mockedAxios.get.mockResolvedValue({
      data: {
        items: [
          {
            track: {
              album: {
                images: [{ url: "https://example.com/album1.jpg" }],
                name: "Album 1",
              },
              name: "Song 1",
              artists: [{ name: "Artist 1" }],
            },
            played_at: "2024-02-12T12:30:00Z",
          },
          {
            track: {
              album: {
                images: [{ url: "https://example.com/album2.jpg" }],
                name: "Album 2",
              },
              name: "Song 2",
              artists: [{ name: "Artist 2" }],
            },
            played_at: "2024-02-12T13:45:00Z",
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
        expect(json).toHaveLength(2);

        expect(json[0]).toMatchObject({
          id: 1,
          albumArtUrl: "https://example.com/album1.jpg",
          album: "Album 1",
          name: "Song 1",
          artist: "Artist 1",
          playedAt: expect.stringMatching(/^\d{2}:\d{2} - \d{2}\/\d{2}\/\d{4}$/),
        });

        expect(json[1]).toMatchObject({
          id: 2,
          albumArtUrl: "https://example.com/album2.jpg",
          album: "Album 2",
          name: "Song 2",
          artist: "Artist 2",
          playedAt: expect.stringMatching(/^\d{2}:\d{2} - \d{2}\/\d{2}\/\d{4}$/),
        });
      },
    });
  });

  it("debe manejar correctamente respuestas sin imágenes o nombres de álbum", async () => {
    mockedCookies.mockReturnValue({
      get: jest.fn().mockReturnValue({ value: "mock_access_token" }),
    });

    mockedAxios.get.mockResolvedValue({
      data: {
        items: [
          {
            track: {
              album: {
                images: [],
                name: "",
              },
              name: "Unnamed Song",
              artists: [{ name: "Unknown Artist" }],
            },
            played_at: "2024-02-12T15:00:00Z",
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
        expect(json).toHaveLength(1);

        expect(json[0]).toMatchObject({
          id: 1,
          albumArtUrl: "",
          album: "",
          name: "Unnamed Song",
          artist: "Unknown Artist",
          playedAt: expect.stringMatching(/^\d{2}:\d{2} - \d{2}\/\d{2}\/\d{4}$/),
        });
      },
    });
  });

  it("debe devolver error 500 si la API de Spotify falla", async () => {
    mockedCookies.mockReturnValue({
      get: jest.fn().mockReturnValue({ value: "mock_access_token" }),
    });

    mockedAxios.get.mockRejectedValue(new Error("Spotify API error"));

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
