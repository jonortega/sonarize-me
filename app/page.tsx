export default function LoginPage() {
  return (
    <main className='flex flex-col items-center justify-center min-h-screen'>
      <h1 className='text-2xl font-bold mb-4'>Bienvenido a Spotify Stats</h1>
      <a href='/api/auth/login' className='px-4 py-2 bg-green-500 text-white font-semibold rounded'>
        Sign In
      </a>
    </main>
  );
}
