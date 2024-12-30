import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Spotify Stats",
  description: "Explora las estadísticas de tu cuenta de Spotify.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='es'>
      <body className='font-sans min-h-screen'>{children}</body>
    </html>
  );
}
