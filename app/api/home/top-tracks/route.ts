import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

const SPOTIFY_API_URL = "https://api.spotify.com/v1/me/top/tracks";
const LIMIT = 5; // Obtener los 5 tracks principales
const DEFAULT_TIME_RANGE = "short_term"; // Rango de tiempo por defecto

interface Track {
  name: string; // Nombre del track
  artists: { name: string }[]; // Artistas del track
  album: {
    images: { url: string; height?: number; width?: number }[]; // Imágenes del álbum
  };
}

// Datos mock para el modo demo
const MOCK_TOP_TRACKS = [
  {
    id: 1,
    name: "Blinding Lights",
    artist: "The Weeknd",
    albumArtUrl: "https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36",
  },
  {
    id: 2,
    name: "As It Was",
    artist: "Harry Styles",
    albumArtUrl: "https://i.scdn.co/image/ab67616d0000b273b46f74097655d7f353caab14",
  },
  {
    id: 3,
    name: "Anti-Hero",
    artist: "Taylor Swift",
    albumArtUrl: "https://i.scdn.co/image/ab67616d0000b273e0b60c608586d88252b8fbc0",
  },
  {
    id: 4,
    name: "Flowers",
    artist: "Miley Cyrus",
    albumArtUrl: "https://picsum.photos/seed/flowers-cover/600/600",
  },
  {
    id: 5,
    name: "Calm Down",
    artist: "Rema",
    albumArtUrl: "https://picsum.photos/seed/calm-down-cover/600/600",
  },
];

export async function GET(req: NextRequest) {
  // Verificar si estamos en modo demo
  const demo_mode = req.cookies.get("demo_mode");

  if (demo_mode?.value === "true") {
    console.log("Modo demo: Devolviendo datos mock de top tracks");
    return NextResponse.json(MOCK_TOP_TRACKS);
  }

  // Flujo normal con API de Spotify
  const authorizationHeader = req.headers.get("authorization");

  if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "No access token provided" }, { status: 401 });
  }

  const access_token = authorizationHeader.split(" ")[1];

  if (!access_token) {
    console.error("No access token provided in cookies");
    return NextResponse.json({ error: "No access token provided" }, { status: 401 });
  }

  // Obtener el parámetro `time_range` de la URL
  const { searchParams } = new URL(req.url);
  const timeRange = searchParams.get("time_range") || DEFAULT_TIME_RANGE;

  try {
    const response = await axios.get(SPOTIFY_API_URL, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
      params: {
        limit: LIMIT,
        time_range: timeRange,
      },
    });

    const data = response.data;

    // Filtrar los datos relevantes para el frontend
    const filteredData = data.items.map((track: Track, index: number) => ({
      id: index + 1,
      name: track.name,
      artist: track.artists?.[0]?.name || "Unknown", // Combinar géneros como representación del artista
      albumArtUrl: track.album?.images[0]?.url || "", // Primera imagen del álbum
    }));

    console.log("\nTop tracks:", filteredData);

    return NextResponse.json(filteredData, { status: 200 });
  } catch (error) {
    console.error("Error fetching top tracks:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
