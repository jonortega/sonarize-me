/**
 * @jest-environment node
 */

import { testApiHandler } from "next-test-api-route-handler";
import * as appHandler from "@/app/api/home/top-artists/route";
import axios from "axios";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("API /home/top-artists", () => {
  it("debe devolver 401 si no se proporciona el token de acceso", async () => {
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

  it("debe devolver 401 si el token de acceso es inválido", async () => {
    await testApiHandler({
      appHandler,
      requestPatcher: (req) => {
        req.headers.append("Authorization", "Bearer ");
      },
      test: async ({ fetch }) => {
        const res = await fetch();
        expect(res.status).toBe(401);
        await expect(res.json()).resolves.toStrictEqual({
          error: "No access token provided",
        });
      },
    });
  });

  it("debe obtener los top 5 artistas correctamente", async () => {
    mockedAxios.get.mockResolvedValue({
      data: {
        items: [
          {
            name: "Artist 1",
            images: [{ url: "https://example.com/image1.jpg" }],
          },
          {
            name: "Artist 2",
            images: [{ url: "https://example.com/image2.jpg" }],
          },
          {
            name: "Artist 3",
            images: [{ url: "https://example.com/image3.jpg" }],
          },
          {
            name: "Artist 4",
            images: [{ url: "https://example.com/image4.jpg" }],
          },
          {
            name: "Artist 5",
            images: [{ url: "https://example.com/image5.jpg" }],
          },
        ],
      },
    });

    await testApiHandler({
      appHandler,
      requestPatcher: (req) => {
        req.headers.append("Authorization", "Bearer mock_access_token");
      },
      test: async ({ fetch }) => {
        const res = await fetch();
        expect(res.status).toBe(200);

        const json = await res.json();
        expect(json).toHaveLength(5);

        expect(json[0]).toMatchObject({
          id: 1,
          name: "Artist 1",
          imageUrl: "https://example.com/image1.jpg",
        });
      },
    });
  });

  it("debe manejar correctamente respuestas malformadas", async () => {
    mockedAxios.get.mockResolvedValue({
      data: { items: null }, // 🚨 Respuesta inválida
    });

    await testApiHandler({
      appHandler,
      requestPatcher: (req) => {
        req.headers.append("Authorization", "Bearer mock_access_token");
      },
      test: async ({ fetch }) => {
        const res = await fetch();
        expect(res.status).toBe(500);
        await expect(res.json()).resolves.toStrictEqual({
          error: "Internal Server Error",
        });
      },
    });
  });

  it("debe devolver error 500 si la API de Spotify falla", async () => {
    mockedAxios.get.mockRejectedValue(new Error("Spotify API error"));

    await testApiHandler({
      appHandler,
      requestPatcher: (req) => {
        req.headers.append("Authorization", "Bearer mock_access_token");
      },
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
