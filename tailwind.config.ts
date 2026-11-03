import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#2a160e",
        cocoa: "#5b2c18",
        clay: "#a85023",
        ember: "#e86f2d",
        cream: "#fff8ef",
        sand: "#f2dfcb",
        sage: "#4b674c",
      },
      boxShadow: {
        soft: "0 24px 70px rgba(77, 38, 17, 0.12)",
        lift: "0 16px 40px rgba(91, 44, 24, 0.18)",
      },
      borderRadius: {
        "4xl": "2rem",
      },
    },
  },
  plugins: [],
};

export default config;
