import { NextResponse } from "next/server";
import { cookies } from "next/headers";

interface SpotifyTrack {
  popularity: number;
}

interface SavedTracksResponse {
  total: number;
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

  const fetchSampledTracks = async (): Promise<SpotifyTrack[]> => {
    const allTracks: SpotifyTrack[] = [];
    const percentage = 0.2; // Usar el 20% de los tracks
    const limit = 50; // Máximo de tracks por petición

    // Primera petición para obtener el total
    const firstResponse = await fetch("https://api.spotify.com/v1/me/tracks?limit=1", {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    if (!firstResponse.ok) {
      throw new Error("Failed to fetch total tracks");
    }

    const firstData: SavedTracksResponse = await firstResponse.json();
    const total = firstData.total;

    console.log("Total saved tracks:", total);

    // Si hay menos de 500 canciones, obtener todas
    if (total <= 500) {
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
        allTracks.push(...data.items.map((item) => item.track));
        nextUrl = data.next;
      }

      console.log("Tracks fetched:", allTracks.length);

      return allTracks;
    }

    // Si hay más de 500 canciones, usar una muestra aleatoria
    let sampleSize = Math.ceil(total * percentage);
    sampleSize = Math.max(500, Math.min(sampleSize, 1000)); // Ajustar entre 500 y 1000

    console.log("Sample size:", sampleSize);

    const numRequests = Math.ceil(sampleSize / limit); // Número de peticiones necesarias

    // Generar offsets aleatorios
    const offsets = Array.from({ length: numRequests }, () => Math.floor(Math.random() * total));

    for (const offset of offsets) {
      const response = await fetch(`https://api.spotify.com/v1/me/tracks?limit=${limit}&offset=${offset}`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch sampled tracks");
      }

      const data: SavedTracksResponse = await response.json();
      allTracks.push(...data.items.map((item) => item.track));
    }

    console.log("Tracks fetched:", allTracks.length);

    return allTracks;
  };

  try {
    // Calcular el valor "normal"
    const sampledTracks = await fetchSampledTracks();
    const normal =
      sampledTracks.length > 0
        ? Math.round(sampledTracks.reduce((sum, track) => sum + track.popularity, 0) / sampledTracks.length)
        : -1; // -1 si no hay canciones favoritas

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

    console.log("==> { normal:", normal, "actual:", actual, " }");

    // Responder con los datos calculados
    return NextResponse.json({ normal, actual });
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json({ error: "Failed to fetch Spotify data" }, { status: 500 });
  }
}
