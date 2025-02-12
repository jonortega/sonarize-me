/**
 * @jest-environment node
 */

import { testApiHandler } from "next-test-api-route-handler";
import * as appHandler from "@/app/api/stats/huella-del-dia/route";
import { RequestCookies } from "next/dist/compiled/@edge-runtime/cookies";
import { cookies } from "next/headers";

jest.mock("next/headers", () => ({
  cookies: jest.fn(),
}));

describe("API /stats/huella-del-dia", () => {
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
          error: "Access token not found",
        });
      },
    });
  });

  it("debe devolver un array de 24 posiciones con valores numéricos", async () => {
    (cookies as jest.MockedFunction<typeof cookies>).mockReturnValue(
      new RequestCookies(new Headers({ Cookie: "access_token=mock_access_token" }))
    );

    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        items: [
          {
            played_at: "2024-02-12T10:15:00Z",
            track: { duration_ms: 180000 },
          },
          {
            played_at: "2024-02-12T22:45:00Z",
            track: { duration_ms: 240000 },
          },
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
        expect(Array.isArray(json)).toBe(true);
        expect(json).toHaveLength(24);
        json.forEach((value) => {
          expect(typeof value).toBe("number");
          expect(value).toBeGreaterThanOrEqual(0);
          expect(value).toBeLessThanOrEqual(60);
        });
      },
    });
  });

  it("debe devolver un error 500 si la API de Spotify falla", async () => {
    (cookies as jest.MockedFunction<typeof cookies>).mockReturnValue(
      new RequestCookies(new Headers({ Cookie: "access_token=mock_access_token" }))
    );

    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({ error: "Internal Server Error" }),
    });

    await testApiHandler({
      appHandler,
      test: async ({ fetch }) => {
        const res = await fetch();
        expect(res.status).toBe(500);
        await expect(res.json()).resolves.toStrictEqual({
          error: "Failed to fetch data",
        });
      },
    });
  });
});
