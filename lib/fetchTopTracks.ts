import { Track } from "@/lib/types";

const DOMAIN_URL = process.env.DOMAIN_URL;

export async function fetchTopTracks(timeRange: string, accessToken: string): Promise<Track[]> {
  try {
    const response = await fetch(`${DOMAIN_URL}/api/home/top-tracks?time_range=${timeRange}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!response.ok) throw new Error("Failed to fetch top tracks");
    return response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}
