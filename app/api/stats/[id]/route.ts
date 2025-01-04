import { NextResponse } from "next/server";

// * THIS IS A MOCK API ROUTE

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = params.id;

  const mockData = {
    "top-tracks": [
      { name: "Shape of You", artist: "Ed Sheeran", album: "÷ (Divide)", playCount: 150 },
      { name: "Blinding Lights", artist: "The Weeknd", album: "After Hours", playCount: 130 },
      { name: "Dance Monkey", artist: "Tones and I", album: "The Kids Are Coming", playCount: 110 },
      { name: "Watermelon Sugar", artist: "Harry Styles", album: "Fine Line", playCount: 95 },
      { name: "Don't Start Now", artist: "Dua Lipa", album: "Future Nostalgia", playCount: 85 },
    ],
    "top-artists": [
      { name: "Ed Sheeran", genre: "Pop", totalPlays: 500, topTrack: "Shape of You" },
      { name: "The Weeknd", genre: "R&B", totalPlays: 450, topTrack: "Blinding Lights" },
      { name: "Dua Lipa", genre: "Pop", totalPlays: 400, topTrack: "Don't Start Now" },
      { name: "Taylor Swift", genre: "Pop", totalPlays: 380, topTrack: "Shake It Off" },
      { name: "Billie Eilish", genre: "Alternative", totalPlays: 350, topTrack: "bad guy" },
    ],
    // ... other stats remain the same
  };

  return NextResponse.json(mockData[id as keyof typeof mockData] || { error: "Stat not found" });
}
