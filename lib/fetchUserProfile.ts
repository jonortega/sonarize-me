import { cookies } from "next/headers";

const DOMAIN_URL = process.env.DOMAIN_URL;

export async function fetchUserProfile() {
  try {
    // Obtener las cookies del servidor
    const cookieStore = await cookies();
    const access_token = cookieStore.get("access_token")?.value;
    const demo_mode = cookieStore.get("demo_mode")?.value;

    console.log("Access token:", access_token);
    console.log("Demo mode:", demo_mode);

    // Si no hay access_token ni estamos en demo, error
    if (!access_token && demo_mode !== "true") {
      return { error: "No access token" };
    }

    // Preparar headers
    const headers: HeadersInit = {};
    if (access_token) {
      headers.Authorization = `Bearer ${access_token}`;
    }

    // IMPORTANTE: Pasar las cookies manualmente en las llamadas internas
    const cookieHeader = [];
    if (access_token) cookieHeader.push(`access_token=${access_token}`);
    if (demo_mode === "true") cookieHeader.push(`demo_mode=${demo_mode}`);

    if (cookieHeader.length > 0) {
      headers.Cookie = cookieHeader.join("; ");
    }

    const response = await fetch(`${DOMAIN_URL}/api/home/user-profile`, {
      headers,
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
