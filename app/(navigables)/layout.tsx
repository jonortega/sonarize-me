import Navbar from "@/components/Navbar";
import { fetchUserProfile } from "@/lib/fetchUserProfile";

export default async function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const userProfile = await fetchUserProfile();

  return (
    <div className='flex flex-col min-h-screen'>
      <Navbar user={userProfile} />
      <div className='flex-grow'>{children}</div>
    </div>
  );
}
