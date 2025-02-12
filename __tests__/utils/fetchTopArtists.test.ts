/**
 * @jest-environment node
 */

import { fetchTopArtists } from "@/lib/fetchTopArtists";
import { Artist } from "@/lib/types";

const mockArtists: Artist[] = [
  { id: "1", name: "Artist 1", imageUrl: "/artist1.jpg" },
  { id: "2", name: "Artist 2", imageUrl: "/artist2.jpg" },
];

const DOMAIN_URL = process.env.DOMAIN_URL;

describe("fetchTopArtists", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("devuelve una lista de artistas correctamente cuando la API responde con éxito", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: async () => mockArtists,
      } as Response)
    );

    const result = await fetchTopArtists("short_term", "mocked_access_token");

    expect(result).toEqual(mockArtists);
    expect(global.fetch).toHaveBeenCalledWith(`${DOMAIN_URL}/api/home/top-artists?time_range=short_term`, {
      headers: { Authorization: "Bearer mocked_access_token" },
    });
  });

  it("devuelve un array vacío si no se proporciona access_token", async () => {
    const result = await fetchTopArtists("short_term", "");
    expect(result).toEqual([]);
  });

  it("devuelve un array vacío si la respuesta de la API no es exitosa", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
      } as Response)
    );

    const result = await fetchTopArtists("short_term", "mocked_access_token");

    expect(result).toEqual([]);
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it("devuelve un array vacío si ocurre un error en la petición", async () => {
    global.fetch = jest.fn(() => Promise.reject(new Error("Network error")));

    const result = await fetchTopArtists("short_term", "mocked_access_token");

    expect(result).toEqual([]);
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });
});
