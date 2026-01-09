import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Syne', 'system-ui', 'sans-serif'],
        grotesk: ['Syne', 'system-ui', 'sans-serif'],
      },
      colors: {
        border: "rgb(229 231 235)",
        background: "rgb(255 255 255)",
        foreground: "rgb(23 23 23)",
      },
    },
  },
  plugins: [],
};
export default config;