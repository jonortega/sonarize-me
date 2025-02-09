import { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import Footer from "@/components/Footer";
// import UnderMaintenance from "@/components/UnderMaintenance";

export const metadata: Metadata = {
  title: "Spotify Stats",
  description: "Explora las estadísticas de tu cuenta de Spotify.",
  icons: {
    icon: "/favicon.svg",
  },
};

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // export default function RootLayout() {
  return (
    <html lang='es'>
      <body className={`${inter.className} bg-spotify-black text-white`}>
        <div className='flex-grow'>{children}</div>
        {/* <UnderMaintenance /> */}
        <Footer />
      </body>
    </html>
  );
}
