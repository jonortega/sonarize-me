import axios from "axios";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const SPOTIFY_API_URL = "https://api.spotify.com/v1/me/tracks";
const SPOTIFY_ARTISTS_API = "https://api.spotify.com/v1/artists";
const LIMIT = 50;

// Fechas de inicio y fin para cada estación
const SEASON_DATES = {
  invierno: { start: { month: 12, day: 21 }, end: { month: 3, day: 20 } },
  primavera: { start: { month: 3, day: 21 }, end: { month: 6, day: 20 } },
  verano: { start: { month: 6, day: 21 }, end: { month: 9, day: 22 } },
  otono: { start: { month: 9, day: 23 }, end: { month: 12, day: 20 } },
};

// Interfaces para la API de Spotify
interface SpotifyTrack {
  added_at: string;
  track: {
    name: string;
    artists: { id: string; name: string }[];
    album: {
      id: string;
      name: string;
      release_date: string;
      images: { url: string }[];
    };
  };
}

interface SpotifyTracksResponse {
  items: SpotifyTrack[];
  next: string | null;
  total: number;
  limit: number;
  offset: number;
}

interface SpotifyArtist {
  id: string;
  name: string;
  genres: string[];
  images: { url: string }[];
}

interface SpotifyArtistsResponse {
  artists: SpotifyArtist[];
}

interface SeasonData {
  artists: Record<string, { count: number; imageUrl: string }>;
  genres: Record<string, number>;
}

interface SeasonResult {
  [key: string]: {
    artist: { name: string; artistPicUrl: string };
    genre: { name: string };
  };
}

// Determinar estación a la que pertenece una fecha
const getSeason = (date: Date): string | null => {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  for (const [season, { start, end }] of Object.entries(SEASON_DATES)) {
    if (
      (month === start.month && day >= start.day) ||
      (month === end.month && day <= end.day) ||
      (month > start.month && month < end.month) ||
      (start.month > end.month && (month > start.month || month < end.month))
    ) {
      return season;
    }
  }
  return null;
};

// Obtener el artista y género destacados por estación
const getArtistAndGenrePerSeason = async (tracks: SpotifyTrack[], accessToken: string): Promise<SeasonResult> => {
  const seasons: Record<string, SeasonData> = {
    invierno: { artists: {}, genres: {} },
    primavera: { artists: {}, genres: {} },
    verano: { artists: {}, genres: {} },
    otono: { artists: {}, genres: {} },
  };

  const artistIds: string[] = [];

  // Agrupar tracks por estación
  for (const track of tracks) {
    const addedAt = new Date(track.added_at);
    const season = getSeason(addedAt);
    if (season) {
      // Contar artistas y almacenar IDs
      track.track.artists.forEach((artist) => {
        artistIds.push(artist.id);
        seasons[season].artists[artist.name] = {
          count: (seasons[season].artists[artist.name]?.count || 0) + 1,
          imageUrl: "", // Esto se llenará más adelante
        };
      });
    }
  }

  // Eliminar duplicados en los IDs de artistas
  const uniqueArtistIds = [...new Set(artistIds)];

  // Obtener datos de artistas en lotes de 50
  for (let i = 0; i < uniqueArtistIds.length; i += 50) {
    const batchIds = uniqueArtistIds.slice(i, i + 50).join(",");
    const response = await axios.get<SpotifyArtistsResponse>(`${SPOTIFY_ARTISTS_API}?ids=${batchIds}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    response.data.artists.forEach((artist) => {
      // Actualizar géneros y la imagen de cada artista
      Object.entries(seasons).forEach(([, data]) => {
        if (data.artists[artist.name]) {
          data.artists[artist.name].imageUrl = artist.images[0]?.url || "";
          artist.genres.forEach((genre) => {
            data.genres[genre] = (data.genres[genre] || 0) + 1;
          });
        }
      });
    });
  }

  // Seleccionar artista y género destacados por estación
  const result: SeasonResult = {};
  for (const [season, data] of Object.entries(seasons)) {
    const topArtist = Object.entries(data.artists).sort((a, b) => b[1].count - a[1].count)[0];
    const topGenre = Object.entries(data.genres).sort((a, b) => b[1] - a[1])[0];
    result[season] = {
      artist: {
        name: topArtist?.[0] || "Artista desconocido",
        artistPicUrl: topArtist?.[1].imageUrl || "https://via.placeholder.com/200",
      },
      genre: {
        name: topGenre?.[0] || "Sin género",
      },
    };
  }

  return result;
};

// Handler del endpoint
export async function GET() {
  const cookieStore = await cookies();
  const access_token = cookieStore.get("access_token")?.value;

  if (!access_token) {
    return NextResponse.json({ error: "No access token provided in cookies" }, { status: 401 });
  }

  try {
    let tracks: SpotifyTrack[] = [];
    let nextUrl: string | null = SPOTIFY_API_URL;

    // Obtener todos los tracks guardados hasta un año atrás
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    while (nextUrl) {
      const response: { data: SpotifyTracksResponse } = await axios.get(nextUrl, {
        headers: { Authorization: `Bearer ${access_token}` },
        params: { limit: LIMIT },
      });

      const fetchedTracks: SpotifyTrack[] = response.data.items.filter(
        (item: SpotifyTrack) => new Date(item.added_at) >= oneYearAgo
      );

      tracks = [...tracks, ...fetchedTracks];
      nextUrl = response.data.next; // Continuar con la paginación
    }

    // Procesar tracks agrupados por estación
    const result = await getArtistAndGenrePerSeason(tracks, access_token);

    console.log("Result from backend:", result);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Error fetching tracks or processing data:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
