import { NextRequest, NextResponse } from "next/server";

const SPOTIFY_API_URL = "https://api.spotify.com/v1/me/top/tracks";
const LIMIT = 16;
const TIME_RANGE = "long_term";

interface SpotifyTrack {
  uri: string;
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

// * GET /api/stats/hall-of-fame
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

// * POST /api/stats/hall-of-fame
export async function POST(req: NextRequest) {
  const access_token = req.cookies.get("access_token")?.value;

  if (!access_token) {
    return NextResponse.json({ error: "No access token provided" }, { status: 401 });
  }

  try {
    // 1. Get the cover image from request body
    const { coverImage } = await req.json();
    console.log("1. Imagen de portada obtenida.");
    console.log("coverImage", coverImage);

    // 2. Get user's top tracks
    const tracksResponse = await fetch(`${SPOTIFY_API_URL}?limit=${LIMIT}&time_range=${TIME_RANGE}`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    if (!tracksResponse.ok) {
      throw new Error(`HTTP error! status: ${tracksResponse.status}`);
    }

    console.log("2. Top 16 tracks obtenidas.");

    const tracksData = await tracksResponse.json();
    const trackUris = tracksData.items.map((track: SpotifyTrack) => track.uri);
    console.log("topTrackUris", trackUris);

    // 3. Get user profile
    const userResponse = await fetch("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    if (!userResponse.ok) {
      throw new Error(`HTTP error! status: ${userResponse.status}`);
    }

    console.log("3. Perfil de usuario obtenido.");

    const userData = await userResponse.json();
    const userId = userData.id;

    console.log("userId", userId);

    // 4. Create new playlist
    const createPlaylistResponse = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "Hall Of Fame",
        description: "Mis 16 canciones más escuchadas.",
        public: false,
      }),
    });

    if (!createPlaylistResponse.ok) {
      throw new Error(`HTTP error! status: ${createPlaylistResponse.status}`);
    }

    console.log("4. Playlist creada.");

    const playlistData = await createPlaylistResponse.json();
    const playlistId = playlistData.id;

    console.log("playlistId", playlistId);

    // 5. Add tracks to playlist
    const addTracksResponse = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        uris: trackUris,
      }),
    });

    if (!addTracksResponse.ok) {
      throw new Error(`HTTP error! status: ${addTracksResponse.status}`);
    }

    console.log("5. Tracks añadidas a la playlist.");

    // 6. Set playlist cover image
    const setImageResponse = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/images`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "image/jpeg",
      },
      body: coverImage,
    });

    if (!setImageResponse.ok) {
      throw new Error(`HTTP error! status: ${setImageResponse.status}`);
    }

    console.log("6. Imagen de portada de la playlist actualizada");

    return NextResponse.json({ success: true, playlistId }, { status: 200 });
  } catch (error) {
    console.error("Error creating playlist:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
