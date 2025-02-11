import { cookies } from "next/headers";

const DOMAIN_URL = process.env.DOMAIN_URL;

export async function fetchUserProfile() {
  try {
    // Obtener las cookies del servidor para acceder al access_token
    const cookieStore = await cookies();
    const access_token = cookieStore.get("access_token")?.value;

    console.log("Access token:", access_token);

    if (!access_token) {
      return { error: "No access token" };
    }

    const response = await fetch(`${DOMAIN_URL}/api/home/user-profile`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
      cache: "force-cache", // Usa caché para evitar múltiples peticiones
      next: { revalidate: 3600 }, // Revalida cada hora
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user profile");
    }

    const userProfile = await response.json();
    console.log("\nUser Profile:", userProfile);

    return userProfile;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error fetching user profile:", error.message);
    } else {
      console.error("Unknown error fetching user profile:", error);
    }
    return { error: "Failed to fetch user profile" };
  }
}
