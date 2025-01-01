import { Suspense } from "react";
import type { Metadata } from "next";
import { getUserStats } from "@/lib/spotify";
import TopTracks from "@/components/TopTracks";
import TopArtists from "@/components/TopArtists";
import TopGenres from "@/components/TopGenres";
import UserProfile from "@/components/UserProfile";
import Loading from "@/components/Loading";
import UserActionPanel from "@/components/UserActionPanel";

export const metadata: Metadata = {
  title: "Home | Spotify Stats",
  description: "Bienvenido a tu Dashboard de Spotify.",
};

export default async function Home() {
  const stats = await getUserStats();

  return (
    <main className='min-h-screen p-4 md:p-8 relative'>
      <div className='absolute top-4 right-4 md:right-8'>
        <UserActionPanel user={stats.user} />
      </div>
      <div className='max-w-5xl mx-auto'>
        <h1 className='text-5xl md:text-5xl font-bold mb-12 text-center bg-gradient-to-r from-spotify-green to-spotify-blue bg-clip-text text-transparent'>
          Your Spotify Stats
        </h1>
        <Suspense fallback={<Loading />}>
          <UserProfile user={stats.user} />
        </Suspense>
        <div className='mt-12 grid grid-cols-1 md:grid-cols-2 gap-6'>
          <Suspense fallback={<Loading />}>
            <TopTracks tracks={stats.topTracks} />
          </Suspense>
          <Suspense fallback={<Loading />}>
            <TopArtists artists={stats.topArtists} />
          </Suspense>
          <div className='md:col-span-2'>
            <Suspense fallback={<Loading />}>
              <TopGenres genres={stats.topGenres} />
            </Suspense>
          </div>
        </div>
      </div>
    </main>
  );
}
