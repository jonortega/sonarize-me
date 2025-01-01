import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "spotify-green": "#1ED760",
        "spotify-black": "#121212",
        "spotify-white": "#FFFFFF",
        "spotify-gray": {
          100: "#B3B3B3",
          200: "#535353",
          300: "#212121",
        },
        "spotify-blue": "#4687D6",
      },
    },
  },
  plugins: [],
} satisfies Config;
