import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const SPOTIFY_PROFILE_URL = "https://api.spotify.com/v1/me";

// Datos mock para el modo demo
const MOCK_USER_PROFILE = {
  name: "Demo User",
  email: "demo@spotify-stats.com",
  imageUrl: "https://i.pravatar.cc/300?img=33", // Avatar placeholder
};

export async function GET(req: NextRequest) {
  console.log("=== USER PROFILE ENDPOINT CALLED ===");
  console.log("Cookies:", req.cookies.getAll());

  // IMPORTANTE: Verificar demo_mode ANTES de verificar el authorization header
  const demo_mode = req.cookies.get("demo_mode");
  console.log("Demo mode cookie:", demo_mode);

  if (demo_mode?.value === "true") {
    console.log("Modo demo: Devolviendo datos mock del perfil de usuario");
    return NextResponse.json(MOCK_USER_PROFILE);
  }

  // Flujo normal con API de Spotify - solo si NO es modo demo
  const authorizationHeader = req.headers.get("authorization");

  if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
    console.log("No access token provided");
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
