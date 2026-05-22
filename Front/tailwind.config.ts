import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          green: "#046a53",
          "green-light": "#e8f5f1",
          yellow: "#fcc419",
        },
      },
    },
  },
  plugins: [],
}

export default config
