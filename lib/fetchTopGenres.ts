import { Genre } from "@/lib/types";

const DOMAIN_URL = process.env.DOMAIN_URL;

export async function fetchTopGenres(timeRange: string, access_token: string): Promise<Genre[]> {
  if (!access_token) {
    console.error("No access token provided");
    return [];
  }

  try {
    const response = await fetch(`${DOMAIN_URL}/api/home/top-genres?time_range=${timeRange}`, {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    if (!response.ok) {
      console.error("Failed to fetch top genres");
      return [];
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching top genres:", error);
    return [];
  }
}
