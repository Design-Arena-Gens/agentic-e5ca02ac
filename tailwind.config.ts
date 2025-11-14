import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0f0f0f",
        surface: "#1a1a1a",
        surfaceHover: "#252525",
        border: "#2d2d2d",
        textPrimary: "#f0f0f0",
        textSecondary: "#a0a0a0",
        textTertiary: "#707070",
        accent: "#6366f1",
        accentHover: "#4f46e5",
        success: "#10b981",
        warning: "#f59e0b",
        error: "#ef4444",
        high: "#ef4444",
        medium: "#f59e0b",
        low: "#10b981",
      },
    },
  },
  plugins: [],
};

export default config;
