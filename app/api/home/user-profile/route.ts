import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const SPOTIFY_PROFILE_URL = "https://api.spotify.com/v1/me";

export async function GET(req: NextRequest) {
  const authorizationHeader = req.headers.get("authorization");

  if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "No access token provided" }, { status: 401 });
  }

  const access_token = authorizationHeader.split(" ")[1];

  try {
    // Realizar la solicitud a la API de Spotify
    const response = await axios.get(SPOTIFY_PROFILE_URL, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    const data = response.data;

    // Filtrar los datos relevantes para el frontend
    const userProfile = {
      name: data.display_name || "Unknown",
      email: data.email || "No email provided",
      imageUrl: data.images?.[0]?.url || "",
    };

    console.log("User Profile:", userProfile);

    return NextResponse.json(userProfile);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error fetching user profile:", error.message);
    } else {
      console.error("Unknown error fetching user profile:", error);
    }
    return NextResponse.json({ error: "Failed to fetch user profile" }, { status: 500 });
  }
}
