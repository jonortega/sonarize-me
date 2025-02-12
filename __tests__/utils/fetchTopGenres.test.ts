/**
 * @jest-environment node
 */

import { fetchTopGenres } from "@/lib/fetchTopGenres";
import { Genre } from "@/lib/types";

const mockGenres: Genre[] = [{ name: "Rock" }, { name: "Pop" }, { name: "Hip-Hop" }];

const DOMAIN_URL = process.env.DOMAIN_URL;

describe("fetchTopGenres", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("devuelve una lista de géneros correctamente cuando la API responde con éxito", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: async () => mockGenres,
      } as Response)
    );

    const result = await fetchTopGenres("short_term", "mocked_access_token");

    expect(result).toEqual(mockGenres);
    expect(global.fetch).toHaveBeenCalledWith(`${DOMAIN_URL}/api/home/top-genres?time_range=short_term`, {
      headers: { Authorization: "Bearer mocked_access_token" },
    });
  });

  it("devuelve un array vacío si no se proporciona access_token", async () => {
    const result = await fetchTopGenres("short_term", "");
    expect(result).toEqual([]);
  });

  it("devuelve un array vacío si la respuesta de la API no es exitosa", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
      } as Response)
    );

    const result = await fetchTopGenres("short_term", "mocked_access_token");

    expect(result).toEqual([]);
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it("devuelve un array vacío si ocurre un error en la petición", async () => {
    global.fetch = jest.fn(() => Promise.reject(new Error("Network error")));

    const result = await fetchTopGenres("short_term", "mocked_access_token");

    expect(result).toEqual([]);
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });
});
