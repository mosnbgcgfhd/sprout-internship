import type { Config } from "tailwindcss";

// Design tokens — "Field Notes" direction:
// a corkboard/index-card metaphor for tracking internship applications.
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        moss: {
          DEFAULT: "#3F6350",
          dark: "#2B4739",
          light: "#5C7E68",
        },
        sand: "#E8DFC8",
        paper: "#F5F1E6",
        ink: "#21201C",
        gold: "#F2B705",
        clay: "#C4562F",
      },
      fontFamily: {
        display: ["Fraunces", "Georgia", "serif"],
        body: ["Inter", "system-ui", "sans-serif"],
        mono: ["'IBM Plex Mono'", "monospace"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(33,32,28,0.06), 0 4px 10px rgba(33,32,28,0.08)",
        pin: "0 2px 4px rgba(33,32,28,0.25)",
      },
      backgroundImage: {
        board:
          "radial-gradient(circle at 1px 1px, rgba(33,32,28,0.06) 1px, transparent 0)",
      },
      backgroundSize: {
        board: "16px 16px",
      },
    },
  },
  plugins: [],
};

export default config;
