import { cookies } from "next/headers";
import { NextResponse } from "next/server";

interface SpotifyImage {
  url: string;
  height: number;
  width: number;
}

interface SpotifyAlbum {
  id: string;
  images: SpotifyImage[];
  release_date: string;
  release_date_precision: "year" | "month" | "day";
}

interface SpotifyTrack {
  album: SpotifyAlbum;
}

interface SpotifyTrackItem {
  track: SpotifyTrack;
}

interface SpotifyResponse {
  items: SpotifyTrackItem[];
  next: string | null;
  total: number;
}

interface ProcessedTrack {
  id: string;
  albumPicUrl: string;
  year: number;
}

async function fetchSavedTracks(access_token: string, url: string): Promise<SpotifyResponse> {
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch tracks: ${response.statusText}`);
  }

  return response.json();
}

function extractYear(releaseDate: string, precision: "year" | "month" | "day"): number {
  switch (precision) {
    case "year":
      return parseInt(releaseDate, 10);
    case "month":
      return parseInt(releaseDate.split("-")[0], 10);
    case "day":
      return parseInt(releaseDate.split("-")[0], 10);
    default:
      return new Date().getFullYear();
  }
}

export async function GET(): Promise<NextResponse> {
  try {
    const cookieStore = await cookies();
    const access_token = cookieStore.get("access_token");

    if (!access_token) {
      return NextResponse.json({ error: "No access token found" }, { status: 401 });
    }

    const tracks: ProcessedTrack[] = [];
    const processedAlbumIds = new Set<string>();
    let url = "https://api.spotify.com/v1/me/tracks?limit=50";

    // Fetch all tracks using pagination
    while (url) {
      const response: SpotifyResponse = await fetchSavedTracks(access_token.value, url);

      // Process each track
      response.items.forEach(({ track }) => {
        // Skip if we've already processed this album
        if (processedAlbumIds.has(track.album.id)) {
          return;
        }

        // Get the largest image available
        // Ensure the album has images before trying to access them
        const albumImage = track.album.images?.sort((a, b) => b.width - a.width)[0];

        // If no image is available, skip this track
        if (!albumImage) {
          console.warn(`No image found for album: ${track.album.id}`);
          return;
        }

        tracks.push({
          id: track.album.id,
          albumPicUrl: albumImage.url,
          year: extractYear(track.album.release_date, track.album.release_date_precision),
        });

        console.log("Processed number of tracks:", tracks.length);

        processedAlbumIds.add(track.album.id);
      });

      // Update URL for next page
      url = response.next || "";
    }

    // Sort tracks by year
    tracks.sort((a, b) => a.year - b.year);

    console.log("Fetched tracks:", tracks);

    return NextResponse.json(tracks);
  } catch (error) {
    console.error("Error fetching tracks:", error);
    return NextResponse.json({ error: "Failed to fetch tracks" }, { status: 500 });
  }
}
