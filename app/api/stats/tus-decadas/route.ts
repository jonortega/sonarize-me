import { NextResponse } from "next/server";

interface TrackData {
  id: string;
  albumPicUrl: string;
  year: number;
}

export async function GET() {
  // Generate mock data
  const mockTracks: TrackData[] = Array.from({ length: 100 }, (_, i) => ({
    id: `track-${i + 1}`,
    albumPicUrl: `https://picsum.photos/seed/${i + 1}/300/300`,
    year: Math.floor(Math.random() * (2023 - 1960 + 1)) + 1960,
  }));

  return NextResponse.json(mockTracks);
}
