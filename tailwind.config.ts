import type { Config } from "tailwindcss";

const config: Config = {
 content: ["./src/app/**/*.tsx", "./src/components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}"],
  theme: { extend: {} },
  plugins: [],
};

export default config;
