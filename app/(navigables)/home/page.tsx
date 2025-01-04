import { Suspense } from "react";
import type { Metadata } from "next";
import TopTracks from "@/components/TopTracks";
import TopArtists from "@/components/TopArtists";
import TopGenres from "@/components/TopGenres";
import UserProfile from "@/components/UserProfile";
import RecentlyPlayed from "@/components/RecentlyPlayed";
import Loading from "@/components/Loading";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: "Home | Spotify Stats",
  description: "Bienvenido a tu Dashboard de Spotify.",
};

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

async function fetchTopTracks() {
  try {
    const cookieStore = await cookies();
    const access_token = cookieStore.get("access_token")?.value;

    console.log("Access token:", access_token);

    if (!access_token) {
      return <div>Error: No access token</div>;
    }

    // * HAY SUSTITUIR LA URL BASE POR LA QUE SEA EN PRODUCCIÓN
    const response = await fetch("http://localhost:3000/api/home/top-tracks", {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch top tracks");
    }

    console.log("\nTop tracks:", response);

    return response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

async function fetchTopArtists() {
  try {
    // Obtener las cookies del servidor para acceder al access_token
    const cookieStore = await cookies();
    const access_token = cookieStore.get("access_token")?.value;

    console.log("Access token:", access_token);

    if (!access_token) {
      return { error: "No access token" };
    }

    // * HAY SUSTITUIR LA URL BASE POR LA QUE SEA EN PRODUCCIÓN
    const response = await fetch("http://localhost:3000/api/home/top-artists", {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch top artists");
    }

    return response.json();
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error fetching top artists:", error.message);
    } else {
      console.error("Unknown error fetching top artists:", error);
    }
    return { error: "Failed to fetch top artists" };
  }
}

async function fetchTopGenres() {
  try {
    // Obtener las cookies del servidor para acceder al access_token
    const cookieStore = await cookies();
    const access_token = cookieStore.get("access_token")?.value;

    console.log("Access token:", access_token);

    if (!access_token) {
      return { error: "No access token" };
    }

    // * HAY QUE SUSTITUIR LA URL BASE POR LA QUE SEA EN PRODUCCIÓN
    const response = await fetch("http://localhost:3000/api/home/top-genres", {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch top genres");
    }

    return response.json();
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error fetching top genres:", error.message);
    } else {
      console.error("Unknown error fetching top genres:", error);
    }
    return { error: "Failed to fetch top genres" };
  }
}

async function fetchRecentlyPlayed() {
  try {
    // Obtener las cookies del servidor para acceder al access_token
    const cookieStore = await cookies();
    const access_token = cookieStore.get("access_token")?.value;

    console.log("Access token:", access_token);

    if (!access_token) {
      return { error: "No access token" };
    }

    // * HAY QUE SUSTITUIR LA URL BASE POR LA QUE SEA EN PRODUCCIÓN
    const response = await fetch("http://localhost:3000/api/home/recently-played", {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch recently played.");
    }

    return response.json();
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error fetching recently played:", error.message);
    } else {
      console.error("Unknown error fetching recently played:", error);
    }
    return { error: "Failed to fetch recently played." };
  }
}

export default async function Home() {
  const userProfile = await fetchUserProfile();
  const topTracks = await fetchTopTracks();
  const topArtists = await fetchTopArtists();
  const topGenres = await fetchTopGenres();
  const recentTracks = await fetchRecentlyPlayed();

  return (
    <main className='min-h-screen relative'>
      <section className='bg-spotify-black'>
        <div className='max-w-5xl mx-auto px-4 md:px-8 py-8'>
          <h1 className='text-4xl md:text-5xl font-bold mb-12 text-center bg-gradient-to-r from-spotify-green to-spotify-blue bg-clip-text text-transparent'>
            Your Spotify Insights
          </h1>
          <Suspense fallback={<Loading />}>
            <UserProfile user={userProfile} />
          </Suspense>
          <div className='mt-12 grid grid-cols-1 md:grid-cols-2 gap-6'>
            <Suspense fallback={<Loading />}>
              <TopTracks tracks={topTracks} />
            </Suspense>
            <Suspense fallback={<Loading />}>
              <TopArtists artists={topArtists} />
            </Suspense>
            <div className='md:col-span-2'>
              <Suspense fallback={<Loading />}>
                <TopGenres genres={topGenres} />
              </Suspense>
            </div>
          </div>
        </div>
      </section>
      <section className='bg-[#0A0A0A]'>
        <div className='max-w-5xl mx-auto px-4 md:px-8 py-12'>
          <Suspense fallback={<Loading />}>
            <RecentlyPlayed recentTracks={recentTracks} />
          </Suspense>
        </div>
      </section>
    </main>
  );
}
