import { NextRequest, NextResponse } from "next/server";

const SPOTIFY_API_URL = "https://api.spotify.com/v1/me/top/tracks";
const LIMIT = 16;
const TIME_RANGE = "long_term";

interface SpotifyTrack {
  name: string;
  artists: { name: string }[];
  album: {
    images: { url: string; height?: number; width?: number }[];
  };
}

interface Album {
  albumArtUrl: string;
  track: string;
  artist: string;
}

export async function GET(req: NextRequest) {
  const access_token = req.cookies.get("access_token")?.value;

  if (!access_token) {
    return NextResponse.json({ error: "No access token provided" }, { status: 401 });
  }

  console.log("ACCESS TOKEN", access_token);

  try {
    const response = await fetch(`${SPOTIFY_API_URL}?limit=${LIMIT}&time_range=${TIME_RANGE}`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    console.log("response", response);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    const hallOfFame: Album[] = data.items.map((track: SpotifyTrack) => ({
      albumArtUrl: track.album.images[0]?.url || "",
      track: track.name,
      artist: track.artists[0]?.name || "Unknown Artist",
    }));

    return NextResponse.json({ title: "Hall of Fame", albums: hallOfFame }, { status: 200 });
  } catch (error) {
    console.error("Error fetching top tracks:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
