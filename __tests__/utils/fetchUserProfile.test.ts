/**
 * @jest-environment node
 */

import { fetchUserProfile } from "@/lib/fetchUserProfile";
import { cookies } from "next/headers";

global.fetch = jest.fn();

// Mock global de `cookies()`
jest.mock("next/headers", () => ({
  cookies: jest.fn(),
}));

describe("fetchUserProfile", () => {
  it("devuelve error si no hay access_token", async () => {
    (cookies as jest.Mock).mockReturnValue({
      get: jest.fn().mockReturnValue(undefined),
    });

    const result = await fetchUserProfile();
    expect(result).toEqual({ error: "No access token" });
  });

  it("maneja errores cuando la API responde con fallo", async () => {
    (cookies as jest.Mock).mockReturnValue({
      get: jest.fn().mockReturnValue({ value: "mocked_token" }),
    });

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
    });

    const result = await fetchUserProfile();
    expect(result).toEqual({ error: "Failed to fetch user profile" });
  });

  it("devuelve el perfil del usuario cuando la API responde correctamente", async () => {
    (cookies as jest.Mock).mockReturnValue({
      get: jest.fn().mockReturnValue({ value: "mocked_token" }),
    });

    const mockUserProfile = { name: "Juan", email: "juan@example.com" };
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockUserProfile),
    });

    const result = await fetchUserProfile();
    expect(result).toEqual(mockUserProfile);
  });
});
