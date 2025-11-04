import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#304FFE",
          foreground: "#ffffff",
        },
        muted: "#f5f5f7",
        border: "#e5e7eb",
      },
      borderRadius: {
        "2xl": "1.5rem",
      },
      boxShadow: {
        soft: "0 20px 40px -24px rgba(31, 41, 55, 0.2)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", ...fontFamily.sans],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
