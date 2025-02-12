import { fetchTopTracks } from "@/lib/fetchTopTracks";

global.fetch = jest.fn();

describe("fetchTopTracks", () => {
  it("devuelve una lista de tracks correctamente", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => [{ id: "1", name: "Song 1", artist: "Artist 1", albumArtUrl: "/img1.jpg" }],
    });

    const tracks = await fetchTopTracks("short_term", "mocked_token");

    expect(tracks).toHaveLength(1);
    expect(tracks[0].name).toBe("Song 1");
  });

  it("maneja errores correctamente", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: async () => ({}),
    });

    const tracks = await fetchTopTracks("short_term", "mocked_token");

    expect(tracks).toEqual([]);
  });
});
