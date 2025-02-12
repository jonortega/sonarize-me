/**
 * @jest-environment node
 */

import { testApiHandler } from "next-test-api-route-handler";
import * as appHandler from "@/app/api/home/user-profile/route";
import axios from "axios";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("API /home/user-profile", () => {
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

  it("debe obtener el perfil de usuario correctamente", async () => {
    mockedAxios.get.mockResolvedValue({
      data: {
        display_name: "Test User",
        email: "testuser@example.com",
        images: [{ url: "https://example.com/profile.jpg" }],
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
        expect(json).toMatchObject({
          name: "Test User",
          email: "testuser@example.com",
          imageUrl: "https://example.com/profile.jpg",
        });
      },
    });
  });

  it("debe manejar correctamente usuarios sin nombre, email o imagen", async () => {
    mockedAxios.get.mockResolvedValue({
      data: {
        display_name: null,
        email: null,
        images: [],
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
        expect(json).toMatchObject({
          name: "Unknown",
          email: "No email provided",
          imageUrl: "",
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
          error: "Failed to fetch user profile",
        });
      },
    });
  });
});
