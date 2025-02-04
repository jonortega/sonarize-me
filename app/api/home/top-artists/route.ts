import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

const SPOTIFY_API_URL = "https://api.spotify.com/v1/me/top/artists";
const LIMIT = 5; // Obtener los 5 tracks principales
const DEFAULT_TIME_RANGE = "medium_term";

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

export async function GET(req: NextRequest) {
  const authorizationHeader = req.headers.get("authorization");

  if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "No access token provided" }, { status: 401 });
  }

  const access_token = authorizationHeader.split(" ")[1];
  console.log("Received access token:", access_token);

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

    console.log("Obtained data from Spotify:", data);

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
