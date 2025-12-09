import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

const SPOTIFY_API_URL = "https://api.spotify.com/v1/me/top/artists";
const LIMIT = 5; // Obtener los 5 tracks principales
const DEFAULT_TIME_RANGE = "short_term";

interface Artist {
  id: string;
  name: string;
  genres: string[];
  followers: {
    total: number;
  };
  images: {
    url: string;
    height?: number;
    width?: number;
  }[];
  popularity: number;
  external_urls: {
    spotify: string;
  };
  uri: string;
}

// Datos mock para el modo demo
const MOCK_TOP_ARTISTS = [
  {
    id: 1,
    name: "The Weeknd",
    imageUrl: "https://i.scdn.co/image/ab6761610000e5eb214f3cf1cbe7139c1e26ffbb",
  },
  {
    id: 2,
    name: "Taylor Swift",
    imageUrl: "https://i.scdn.co/image/ab6761610000e5ebe672b5f553298dcdccb0e676",
  },
  {
    id: 3,
    name: "Bad Bunny",
    imageUrl: "https://picsum.photos/seed/badbunny-artist/600/600",
  },
  {
    id: 4,
    name: "Drake",
    imageUrl: "https://i.scdn.co/image/ab6761610000e5eb4293385d324db8558179afd9",
  },
  {
    id: 5,
    name: "Ed Sheeran",
    imageUrl: "https://picsum.photos/seed/edsheeran-artist/600/600",
  },
];

export async function GET(req: NextRequest) {
  // Verificar si estamos en modo demo
  const demo_mode = req.cookies.get("demo_mode");

  if (demo_mode?.value === "true") {
    console.log("Modo demo: Devolviendo datos mock de top artists");
    return NextResponse.json(MOCK_TOP_ARTISTS);
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
    const filteredData = data.items.map((artist: Artist, index: number) => ({
      id: index + 1,
      name: artist.name,
      imageUrl: artist.images?.[0]?.url || "",
    }));

    console.log("\nTop artists:", filteredData);

    return NextResponse.json(filteredData, { status: 200 });
  } catch (error) {
    console.error("Error fetching top tracks:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
