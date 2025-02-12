/**
 * @jest-environment node
 */

import { testApiHandler } from "next-test-api-route-handler";
import * as appHandler from "@/app/api/stats/la-bitacora/route";
import { RequestCookies } from "next/dist/compiled/@edge-runtime/cookies";
import { cookies } from "next/headers";

jest.mock("next/headers", () => ({
  cookies: jest.fn(),
}));

global.fetch = jest.fn();

describe("API /stats/la-bitacora", () => {
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
          error: "Unauthorized",
        });
      },
    });
  });

  it("debe devolver el número de canciones guardadas por año", async () => {
    (cookies as jest.MockedFunction<typeof cookies>).mockReturnValue(
      new RequestCookies(new Headers({ Cookie: "access_token=mock_access_token" }))
    );

    (global.fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        items: [
          { added_at: "2023-06-15T10:00:00Z" },
          { added_at: "2023-07-20T12:00:00Z" },
          { added_at: "2022-05-10T15:30:00Z" },
        ],
        next: null,
      }),
    });

    await testApiHandler({
      appHandler,
      test: async ({ fetch }) => {
        const res = await fetch();
        expect(res.status).toBe(200);

        const json = await res.json();
        expect(json).toMatchObject({
          "2023": 2,
          "2022": 1,
        });
      },
    });
  });

  it("debe devolver el número de canciones guardadas por mes en un año específico", async () => {
    (cookies as jest.MockedFunction<typeof cookies>).mockReturnValue(
      new RequestCookies(new Headers({ Cookie: "access_token=mock_access_token" }))
    );

    (global.fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        items: [
          { added_at: "2023-06-15T10:00:00Z" },
          { added_at: "2023-07-20T12:00:00Z" },
          { added_at: "2023-07-22T14:00:00Z" },
        ],
        next: null,
      }),
    });

    await testApiHandler({
      appHandler,
      url: "/api/stats/la-bitacora?year=2023",
      test: async ({ fetch }) => {
        const res = await fetch();
        expect(res.status).toBe(200);

        const json = await res.json();
        expect(json).toMatchObject({
          "2023-06": 1,
          "2023-07": 2,
        });
      },
    });
  });

  it("debe devolver el número de canciones guardadas por día en un mes específico", async () => {
    (cookies as jest.MockedFunction<typeof cookies>).mockReturnValue(
      new RequestCookies(new Headers({ Cookie: "access_token=mock_access_token" }))
    );

    (global.fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        items: [
          { added_at: "2023-07-15T10:00:00Z" },
          { added_at: "2023-07-15T12:00:00Z" },
          { added_at: "2023-07-20T18:00:00Z" },
        ],
        next: null,
      }),
    });

    await testApiHandler({
      appHandler,
      url: "/api/stats/la-bitacora?year=2023&month=07",
      test: async ({ fetch }) => {
        const res = await fetch();
        expect(res.status).toBe(200);

        const json = await res.json();
        expect(json).toMatchObject({
          "2023-07-15": 2,
          "2023-07-20": 1,
        });
      },
    });
  });

  it("debe devolver error 500 si la API de Spotify falla", async () => {
    (cookies as jest.MockedFunction<typeof cookies>).mockReturnValue(
      new RequestCookies(new Headers({ Cookie: "access_token=mock_access_token" }))
    );

    (global.fetch as jest.MockedFunction<typeof fetch>).mockRejectedValueOnce(new Error("API Error"));

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
