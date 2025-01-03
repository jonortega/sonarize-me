import Navbar from "@/components/Navbar";
import { getUserStats } from "@/lib/spotify";

export default async function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const stats = await getUserStats();

  return (
    <div className='flex flex-col min-h-screen'>
      <Navbar user={stats.user} />
      <div className='flex-grow'>{children}</div>
    </div>
  );
}
