import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const accessToken = (await cookies()).get("access_token")?.value;

  if (!accessToken) {
    return NextResponse.json({ error: "Access token not found" }, { status: 401 });
  }

  let url = "https://api.spotify.com/v1/me/player/recently-played?limit=50";
  const allTracks = [];
  let next = true;

  try {
    // Recuperar todas las canciones (paginar si es necesario)
    while (next) {
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("Spotify API error:", error);
        return NextResponse.json({ error: "Failed to fetch data" }, { status: response.status });
      }

      const data = await response.json();
      allTracks.push(...data.items);

      if (data.next) {
        url = data.next;
      } else {
        next = false;
      }
    }

    // Inicializar array de 24 posiciones para las horas del día
    const listeningHours = Array(24).fill(0);

    allTracks.forEach((track: { played_at: string; track: { duration_ms: number } }) => {
      const playedAt = new Date(track.played_at);
      const hour = playedAt.getHours();

      const trackDurationMs = track.track.duration_ms;
      const timeListenedMinutes = Math.max(0, Math.min(trackDurationMs / 1000 / 60, 60));

      listeningHours[hour] = Math.min(60, listeningHours[hour] + timeListenedMinutes); // Max 60 mins por hora
    });

    console.log("Listening hours distribution:", listeningHours);

    return NextResponse.json(listeningHours);
  } catch (error) {
    console.error("Error in /api/stats/huella-del-dia:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
