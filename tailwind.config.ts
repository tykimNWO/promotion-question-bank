import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        seoul: {
          light: "rgb(255, 72, 0)",
          ink: "rgb(20, 20, 18)",
          paper: "rgb(252, 249, 244)",
          line: "rgb(44, 43, 39)",
          mint: "rgb(26, 139, 83)",
          smoke: "rgb(236, 232, 224)"
        }
      },
      boxShadow: {
        signal: "8px 8px 0 rgb(20, 20, 18)"
      }
    }
  },
  plugins: []
};

export default config;
