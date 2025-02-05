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

export async function GET(req: NextRequest) {
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
