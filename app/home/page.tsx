import { Suspense } from "react";
import type { Metadata } from "next";
import { getUserStats } from "@/lib/spotify";
import TopTracks from "@/components/TopTracks";
import TopArtists from "@/components/TopArtists";
import TopGenres from "@/components/TopGenres";
import UserProfile from "@/components/UserProfile";
import Loading from "@/components/Loading";

export const metadata: Metadata = {
  title: "Home | Spotify Stats",
  description: "Bienvenido a tu Dashboard de Spotify.",
};

export default async function Home() {
  const stats = await getUserStats();

  return (
    <main className='min-h-screen p-4 md:p-8'>
      <h1 className='text-4xl font-bold mb-8'>Your Spotify Stats</h1>
      <Suspense fallback={<Loading />}>
        <UserProfile user={stats.user} />
      </Suspense>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8'>
        <Suspense fallback={<Loading />}>
          <TopTracks tracks={stats.topTracks} />
        </Suspense>
        <Suspense fallback={<Loading />}>
          <TopArtists artists={stats.topArtists} />
        </Suspense>
        <Suspense fallback={<Loading />}>
          <TopGenres genres={stats.topGenres} />
        </Suspense>
      </div>
    </main>
  );
}
