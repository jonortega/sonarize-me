import { Artist } from "@/lib/types";

const DOMAIN_URL = process.env.DOMAIN_URL;

export async function fetchTopArtists(timeRange: string, access_token: string): Promise<Artist[]> {
  if (!access_token) {
    console.error("No access token provided");
    return [];
  }

  try {
    const response = await fetch(`${DOMAIN_URL}/api/home/top-artists?time_range=${timeRange}`, {
      headers: { Authorization: `Bearer ${access_token}` },
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
