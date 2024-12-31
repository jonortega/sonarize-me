import { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Spotify Stats",
  description: "Explora las estadísticas de tu cuenta de Spotify.",
};

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='es'>
      <body className={`${inter.className} bg-spotify-black text-white`}>{children}</body>
    </html>
  );
}
