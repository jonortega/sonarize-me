import { Artist } from "@/lib/types";
import { cookies } from "next/headers";

const DOMAIN_URL = process.env.DOMAIN_URL;

export async function fetchTopArtists(timeRange: string, access_token: string): Promise<Artist[]> {
  // Obtener las cookies del servidor
  const cookieStore = await cookies();
  const demo_mode = cookieStore.get("demo_mode")?.value;

  // Si no hay access_token ni estamos en demo, retornar array vacío
  if (!access_token && demo_mode !== "true") {
    console.error("No access token provided");
    return [];
  }

  try {
    // Preparar headers
    const headers: HeadersInit = {};
    if (access_token) {
      headers.Authorization = `Bearer ${access_token}`;
    }

    // IMPORTANTE: Pasar las cookies manualmente en las llamadas internas
    const cookieHeader = [];
    if (access_token) cookieHeader.push(`access_token=${access_token}`);
    if (demo_mode === "true") cookieHeader.push(`demo_mode=${demo_mode}`);

    if (cookieHeader.length > 0) {
      headers.Cookie = cookieHeader.join("; ");
    }

    const response = await fetch(`${DOMAIN_URL}/api/home/top-artists?time_range=${timeRange}`, {
      headers,
    });

    if (!response.ok) {
      console.error("Failed to fetch top artists");
      return [];
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching top artists:", error);
    return [];
  }
}
