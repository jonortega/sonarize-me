import { Suspense } from "react";
import type { Metadata } from "next";
import { getUserStats } from "@/lib/spotify";
import TopTracks from "@/components/TopTracks";
import TopArtists from "@/components/TopArtists";
import TopGenres from "@/components/TopGenres";
import UserProfile from "@/components/UserProfile";
import RecentlyPlayed from "@/components/RecentlyPlayed";
import Loading from "@/components/Loading";

export const metadata: Metadata = {
  title: "Home | Spotify Stats",
  description: "Bienvenido a tu Dashboard de Spotify.",
};

export default async function Home() {
  const stats = await getUserStats();

  return (
    <main className='min-h-screen relative'>
      <section className='bg-spotify-black'>
        <div className='max-w-5xl mx-auto px-4 md:px-8 py-8'>
          <h1 className='text-4xl md:text-5xl font-bold mb-12 text-center bg-gradient-to-r from-spotify-green to-spotify-blue bg-clip-text text-transparent'>
            Your Spotify Insights
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
      </section>
      <section className='bg-[#0A0A0A]'>
        <div className='max-w-5xl mx-auto px-4 md:px-8 py-12'>
          <Suspense fallback={<Loading />}>
            <RecentlyPlayed />
          </Suspense>
        </div>
      </section>
    </main>
  );
}
