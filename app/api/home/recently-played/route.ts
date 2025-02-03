import axios from "axios";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const SPOTIFY_RECENTLY_PLAYED_URL = "https://api.spotify.com/v1/me/player/recently-played";
const LIMIT = 50; // Obtener las últimas 50 canciones reproducidas

interface RecentlyPlayedTrack {
  id: number;
  albumArtUrl: string;
  album: string;
  name: string;
  artist: string;
  playedAt: string;
}

interface SpotifyRecentlyPlayedItem {
  track: {
    album: {
      images: { url: string }[];
      name: string;
    };
    name: string;
    artists: { name: string }[];
  };
  played_at: string;
}

export async function GET() {
  const access_token = (await cookies()).get("access_token")?.value;

  if (!access_token) {
    return NextResponse.json({ error: "No access token provided" }, { status: 401 });
  }

  try {
    // Hacer la petición a la API de Spotify para obtener las canciones recientemente reproducidas
    const response = await axios.get(SPOTIFY_RECENTLY_PLAYED_URL, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
      params: {
        limit: LIMIT,
      },
    });

    const items = response.data.items;

    const formatDate = (dateString: string): string => {
      const date = new Date(dateString);
      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Los meses empiezan en 0
      const year = date.getFullYear();
      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");

      return `${hours}:${minutes} - ${day}/${month}/${year}`;
    };

    // Transformar los datos en el formato esperado por el frontend
    const recentlyPlayedTracks: RecentlyPlayedTrack[] = items.map((item: SpotifyRecentlyPlayedItem, index: number) => ({
      id: index + 1,
      albumArtUrl: item.track.album.images[0]?.url || "",
      album: item.track.album.name || "",
      name: item.track.name || "",
      artist: item.track.artists[0]?.name || "",
      playedAt: formatDate(item.played_at),
    }));

    return NextResponse.json(recentlyPlayedTracks, { status: 200 });
  } catch (error) {
    console.error("Error fetching recently played tracks:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
