import { NextResponse } from "next/server";
import { cookies } from "next/headers";

type TrackData = {
  year: string;
  month: string;
  day: string;
};

type AggregatedData = {
  [key: string]: number; // key: period (year, month, day), value: track count
};

let cache: {
  years: AggregatedData;
  months: { [year: string]: AggregatedData };
  days: { [yearMonth: string]: AggregatedData };
} | null = null;

// Function to fetch all saved tracks from Spotify
async function fetchAllSavedTracks(accessToken: string): Promise<TrackData[]> {
  const url = "https://api.spotify.com/v1/me/tracks";
  let tracks: TrackData[] = [];
  let next = url;

  while (next) {
    const response = await fetch(next, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) throw new Error("Failed to fetch data from Spotify");

    const data = await response.json();

    tracks = tracks.concat(
      data.items.map((item: { added_at: string }) => {
        const addedAt = new Date(item.added_at);
        return {
          year: addedAt.getFullYear().toString(),
          month: (addedAt.getMonth() + 1).toString().padStart(2, "0"),
          day: addedAt.getDate().toString().padStart(2, "0"),
        };
      })
    );

    console.log("Number of tracks fetched:", tracks.length);

    next = data.next;
  }

  return tracks;
}

// Function to aggregate tracks by a specific period
function aggregateTracks(tracks: TrackData[], period: "year" | "month" | "day"): AggregatedData {
  return tracks.reduce((acc: AggregatedData, track) => {
    const key =
      period === "year"
        ? track.year
        : period === "month"
          ? `${track.year}-${track.month}`
          : `${track.year}-${track.month}-${track.day}`;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const cookieStore = await cookies();
  const access_token = cookieStore.get("access_token")?.value;

  if (!access_token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Extract query parameters
  const year = url.searchParams.get("year");
  const month = url.searchParams.get("month");

  // Check cache or fetch and process data
  if (!cache) {
    const tracks = await fetchAllSavedTracks(access_token);
    cache = {
      years: aggregateTracks(tracks, "year"),
      months: {},
      days: {},
    };

    for (const yearKey in cache.years) {
      const yearTracks = tracks.filter((t) => t.year === yearKey);
      cache.months[yearKey] = aggregateTracks(yearTracks, "month");

      for (const monthKey in cache.months[yearKey]) {
        const [y, m] = monthKey.split("-");
        const monthTracks = yearTracks.filter((t) => t.month === m);
        cache.days[`${y}-${m}`] = aggregateTracks(monthTracks, "day");

        console.log(`Processed days for ${y}-${m}:`, cache.days[`${y}-${m}`]);
      }
    }
  }

  // Return appropriate data based on query params
  if (!year) {
    // Return aggregated data by year
    return NextResponse.json(cache.years);
  }

  if (year && !month) {
    // Return aggregated data by month for the given year
    return NextResponse.json(cache.months[year] || {});
  }

  // if (year && month) {
  //   // Return aggregated data by day for the given month
  //   return NextResponse.json(cache.days[`${year}-${month}`] || {});
  // }

  // * Eliminar despues de comprobación. Código dinal es el de arriba.
  if (year && month) {
    const key = `${year}-${month}`;
    console.log(`Fetching data for days in: ${key}`);
    console.log("Data in cache.days:", cache.days[key]); // Verifica si existe el dato esperado

    // Return the data if available, or an empty object if not
    return NextResponse.json(cache.days[key] || {});
  }

  return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
}
