import { NextResponse } from "next/server";
import { cookies } from "next/headers";

interface SpotifyTrack {
  popularity: number;
}

interface SavedTracksResponse {
  next: string | null;
  items: { track: SpotifyTrack }[];
}

interface RecentlyPlayedResponse {
  items: { track: SpotifyTrack }[];
}

export async function GET(): Promise<NextResponse> {
  const access_token = (await cookies()).get("access_token")?.value;

  if (!access_token) {
    return NextResponse.json({ error: "Access token not found" }, { status: 401 });
  }

  const fetchAllSavedTracks = async (): Promise<SpotifyTrack[]> => {
    const allTracks: SpotifyTrack[] = [];
    let nextUrl: string | null = "https://api.spotify.com/v1/me/tracks?limit=50";

    while (nextUrl) {
      const response = await fetch(nextUrl, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch saved tracks");
      }

      const data: SavedTracksResponse = await response.json();
      allTracks.push(...data.items.map((item) => item.track)); // Agregar los tracks actuales

      console.log("Tracks cargados:", allTracks.length);

      nextUrl = data.next; // Actualizar la URL del siguiente conjunto de resultados
    }

    return allTracks;
  };

  try {
    // Calcular el valor "normal"
    const savedTracks = await fetchAllSavedTracks();
    const normal =
      savedTracks.length > 0
        ? Math.round(savedTracks.reduce((sum, track) => sum + track.popularity, 0) / savedTracks.length)
        : 0;

    // Calcular el valor "actual"
    const recentlyPlayedUrl = "https://api.spotify.com/v1/me/player/recently-played?limit=50";
    const recentlyPlayedResponse = await fetch(recentlyPlayedUrl, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    if (!recentlyPlayedResponse.ok) {
      throw new Error("Failed to fetch recently played tracks");
    }

    const recentlyPlayedData: RecentlyPlayedResponse = await recentlyPlayedResponse.json();
    const actual =
      recentlyPlayedData.items.length > 0
        ? Math.round(
            recentlyPlayedData.items.reduce((sum, item) => sum + item.track.popularity, 0) /
              recentlyPlayedData.items.length
          )
        : 0;

    console.log("normal:", normal, "actual:", actual);

    // Responder con los datos calculados
    return NextResponse.json({ normal, actual });
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json({ error: "Failed to fetch Spotify data" }, { status: 500 });
  }
}
