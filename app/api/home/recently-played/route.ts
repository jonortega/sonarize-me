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

// Datos mock para el modo demo
const MOCK_RECENTLY_PLAYED: RecentlyPlayedTrack[] = [
  {
    id: 1,
    albumArtUrl: "https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36",
    album: "After Hours",
    name: "Blinding Lights",
    artist: "The Weeknd",
    playedAt: "14:23 - 07/10/2025",
  },
  {
    id: 2,
    albumArtUrl: "https://i.scdn.co/image/ab67616d0000b273b46f74097655d7f353caab14",
    album: "Harry's House",
    name: "As It Was",
    artist: "Harry Styles",
    playedAt: "13:45 - 07/10/2025",
  },
  {
    id: 3,
    albumArtUrl: "https://i.scdn.co/image/ab67616d0000b273e0b60c608586d88252b8fbc0",
    album: "Midnights",
    name: "Anti-Hero",
    artist: "Taylor Swift",
    playedAt: "12:30 - 07/10/2025",
  },
  {
    id: 4,
    albumArtUrl: "https://picsum.photos/seed/flowers-cover/600/600",
    album: "Endless Summer Vacation",
    name: "Flowers",
    artist: "Miley Cyrus",
    playedAt: "11:15 - 07/10/2025",
  },
  {
    id: 5,
    albumArtUrl: "https://picsum.photos/seed/calm-down-cover/600/600",
    album: "Rave & Roses",
    name: "Calm Down",
    artist: "Rema",
    playedAt: "10:00 - 07/10/2025",
  },
  {
    id: 6,
    albumArtUrl: "https://picsum.photos/seed/dua-lipa-future-nostalgia/600/600",
    album: "Future Nostalgia",
    name: "Levitating",
    artist: "Dua Lipa",
    playedAt: "09:40 - 07/10/2025",
  },
  {
    id: 7,
    albumArtUrl: "https://picsum.photos/seed/the-weeknd-save-your-tears/600/600",
    album: "After Hours",
    name: "Save Your Tears",
    artist: "The Weeknd",
    playedAt: "09:20 - 07/10/2025",
  },
  {
    id: 8,
    albumArtUrl: "https://picsum.photos/seed/lilnasx-industry-baby/600/600",
    album: "MONTERO",
    name: "INDUSTRY BABY",
    artist: "Lil Nas X, Jack Harlow",
    playedAt: "09:00 - 07/10/2025",
  },
  {
    id: 9,
    albumArtUrl: "https://picsum.photos/seed/ed-sheeran-divide/600/600",
    album: "÷ (Divide)",
    name: "Shape of You",
    artist: "Ed Sheeran",
    playedAt: "08:45 - 07/10/2025",
  },
  {
    id: 10,
    albumArtUrl: "https://picsum.photos/seed/billie-eilish-when-we-all-fall-asleep/600/600",
    album: "WHEN WE ALL FALL ASLEEP, WHERE DO WE GO?",
    name: "bad guy",
    artist: "Billie Eilish",
    playedAt: "08:30 - 07/10/2025",
  },
  {
    id: 11,
    albumArtUrl: "https://picsum.photos/seed/tones-and-i-dance-monkey/600/600",
    album: "The Kids Are Coming",
    name: "Dance Monkey",
    artist: "Tones and I",
    playedAt: "08:10 - 07/10/2025",
  },
  {
    id: 12,
    albumArtUrl: "https://picsum.photos/seed/justin-bieber-justice/600/600",
    album: "Justice",
    name: "Peaches",
    artist: "Justin Bieber, Daniel Caesar, Giveon",
    playedAt: "07:55 - 07/10/2025",
  },
  {
    id: 13,
    albumArtUrl: "https://picsum.photos/seed/the-kid-laroi-stay/600/600",
    album: "F*CK LOVE 3: OVER YOU",
    name: "STAY",
    artist: "The Kid LAROI, Justin Bieber",
    playedAt: "07:40 - 07/10/2025",
  },
  {
    id: 14,
    albumArtUrl: "https://picsum.photos/seed/harry-styles-fine-line/600/600",
    album: "Fine Line",
    name: "Watermelon Sugar",
    artist: "Harry Styles",
    playedAt: "07:25 - 07/10/2025",
  },
  {
    id: 15,
    albumArtUrl: "https://picsum.photos/seed/lady-gaga-a-star-is-born/600/600",
    album: "A Star Is Born Soundtrack",
    name: "Shallow",
    artist: "Lady Gaga, Bradley Cooper",
    playedAt: "07:10 - 07/10/2025",
  },
  {
    id: 16,
    albumArtUrl: "https://picsum.photos/seed/lewis-capaldi-divinely-uninspired/600/600",
    album: "Divinely Uninspired to a Hellish Extent",
    name: "Someone You Loved",
    artist: "Lewis Capaldi",
    playedAt: "06:55 - 07/10/2025",
  },
  {
    id: 17,
    albumArtUrl: "https://picsum.photos/seed/the-weeknd-starboy/600/600",
    album: "Starboy",
    name: "Starboy",
    artist: "The Weeknd, Daft Punk",
    playedAt: "06:40 - 07/10/2025",
  },
  {
    id: 18,
    albumArtUrl: "https://picsum.photos/seed/glass-animals-dreamland/600/600",
    album: "Dreamland",
    name: "Heat Waves",
    artist: "Glass Animals",
    playedAt: "06:25 - 07/10/2025",
  },
  {
    id: 19,
    albumArtUrl: "https://picsum.photos/seed/billie-eilish-happier-than-ever/600/600",
    album: "Happier Than Ever",
    name: "Happier Than Ever",
    artist: "Billie Eilish",
    playedAt: "06:10 - 07/10/2025",
  },
  {
    id: 20,
    albumArtUrl: "https://picsum.photos/seed/calvin-harris-one-kiss/600/600",
    album: "One Kiss (Single)",
    name: "One Kiss",
    artist: "Calvin Harris, Dua Lipa",
    playedAt: "06:05 - 07/10/2025",
  },
];

export async function GET() {
  const cookieStore = await cookies();
  const demo_mode = cookieStore.get("demo_mode")?.value;

  // Verificar si estamos en modo demo
  if (demo_mode === "true") {
    console.log("Modo demo: Devolviendo datos mock de recently played");
    return NextResponse.json(MOCK_RECENTLY_PLAYED);
  }

  // Flujo normal con API de Spotify
  const access_token = cookieStore.get("access_token")?.value;

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
