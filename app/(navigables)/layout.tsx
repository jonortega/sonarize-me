import Navbar from "@/components/Navbar";
import { cookies } from "next/headers";

async function fetchUserProfile() {
  try {
    // Obtener las cookies del servidor para acceder al access_token
    const cookieStore = await cookies();
    const access_token = cookieStore.get("access_token")?.value;

    console.log("Access token:", access_token);

    if (!access_token) {
      return { error: "No access token" };
    }

    // * HAY SUSTITUIR LA URL BASE POR LA QUE SEA EN PRODUCCIÓN
    const response = await fetch("http://localhost:3000/api/home/user-profile", {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
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

export default async function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const userProfile = await fetchUserProfile();

  return (
    <div className='flex flex-col min-h-screen'>
      <Navbar user={userProfile} />
      <div className='flex-grow'>{children}</div>
    </div>
  );
}
