import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Sovereign Symbiosis Palette
        void: "#050505",
        "singularity-white": "#F2F2F2",
        "cherenkov-blue": "#00F0FF",
        "weyl-violet": "#6E00FF",
        "lattice-gray": "#1A1A1A",
        "decoherence-red": "#FF2D00",
      },
      fontFamily: {
        grotesk: ["var(--font-space-grotesk)", "sans-serif"],
        serif: ["var(--font-stix-two-text)", "serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      animation: {
        "pulse-slow": "pulse-void 8s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        "pulse-void": {
          "0%, 100%": { opacity: "0.8" },
          "50%": { opacity: "0.4" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
