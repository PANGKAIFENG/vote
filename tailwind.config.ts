import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#172033",
        paper: "#f7fafc",
        line: "#d8e2ef"
      },
      boxShadow: {
        soft: "0 18px 45px rgba(24, 39, 75, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
