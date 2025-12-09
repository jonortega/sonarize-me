import { Track } from "@/lib/types";
import { cookies } from "next/headers";

const DOMAIN_URL = process.env.DOMAIN_URL;

export async function fetchTopTracks(timeRange: string, accessToken: string): Promise<Track[]> {
  try {
    // Obtener las cookies del servidor
    const cookieStore = await cookies();
    const demo_mode = cookieStore.get("demo_mode")?.value;

    // Preparar headers
    const headers: HeadersInit = {};
    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }

    // IMPORTANTE: Pasar las cookies manualmente en las llamadas internas
    const cookieHeader = [];
    if (accessToken) cookieHeader.push(`access_token=${accessToken}`);
    if (demo_mode === "true") cookieHeader.push(`demo_mode=${demo_mode}`);

    if (cookieHeader.length > 0) {
      headers.Cookie = cookieHeader.join("; ");
    }

    const response = await fetch(`${DOMAIN_URL}/api/home/top-tracks?time_range=${timeRange}`, {
      headers,
    });

    if (!response.ok) throw new Error("Failed to fetch top tracks");
    return response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}
