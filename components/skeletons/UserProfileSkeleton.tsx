import SkeletonBlock from "@/components/skeletons/SkeletonBlock";

export default function UserProfileSkeleton() {
  return (
    <div className='flex items-center justify-center space-x-4 bg-spotify-gray-300 p-6 rounded-lg border-2 border-spotify-gray-200 max-w-sm mx-auto shadow-lg'>
      {/* Avatar */}
      <SkeletonBlock width='80px' height='80px' rounded />

      <div className='flex-grow space-y-3'>
        {/* Nombre */}
        <SkeletonBlock width='70%' height='1.5rem' />
        {/* Email */}
        <SkeletonBlock width='50%' height='1rem' />
      </div>
    </div>
  );
}
