/**
 * @jest-environment node
 */

import { testApiHandler } from "next-test-api-route-handler";
import * as appHandler from "@/app/api/home/top-genres/route";
import axios from "axios";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("API /home/top-genres", () => {
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

  it("debe obtener los top 5 géneros correctamente", async () => {
    mockedAxios.get.mockResolvedValue({
      data: {
        items: [
          { name: "Artist 1", genres: ["Rock", "Alternative"] },
          { name: "Artist 2", genres: ["Pop", "Rock"] },
          { name: "Artist 3", genres: ["Hip-Hop", "Rap"] },
          { name: "Artist 4", genres: ["Jazz", "Blues"] },
          { name: "Artist 5", genres: ["Rock", "Indie"] },
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

        expect(json[0]).toHaveProperty("id");
        expect(json[0]).toHaveProperty("name");
        expect(typeof json[0].name).toBe("string");
      },
    });
  });

  it("debe manejar correctamente artistas sin géneros", async () => {
    mockedAxios.get.mockResolvedValue({
      data: {
        items: [
          { name: "Artist 1", genres: [] },
          { name: "Artist 2", genres: ["Pop"] },
          { name: "Artist 3", genres: ["Rock"] },
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
        expect(json).toHaveLength(2); // Solo debe devolver géneros válidos

        expect(json).toEqual(
          expect.arrayContaining([expect.objectContaining({ name: "Pop" }), expect.objectContaining({ name: "Rock" })])
        );
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
