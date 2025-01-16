import { NextResponse } from "next/server";

interface TrackData {
  id: string;
  albumPicUrl: string;
  year: number;
}

function normalDistribution(mean: number, stdDev: number): number {
  const u1 = Math.random();
  const u2 = Math.random();
  const z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
  return Math.round(mean + z * stdDev);
}

export async function GET() {
  // Parameters for normal distribution
  const meanYear = 1985; // Center around 1985
  const stdDev = 15; // Standard deviation of 15 years
  const totalTracks = 200; // Total number of tracks

  const mockTracks: TrackData[] = Array.from({ length: totalTracks }, (_, i) => {
    // Generate year using normal distribution and clamp between 1950 and 2023
    let year = normalDistribution(meanYear, stdDev);
    year = Math.max(1950, Math.min(2023, year));

    return {
      id: `track-${i + 1}`,
      albumPicUrl: `https://picsum.photos/seed/${i + 1}/300/300`,
      year,
    };
  });

  // Simulate a delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  return NextResponse.json(mockTracks);
}
