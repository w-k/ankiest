// tailwind.config.js
module.exports = {
  content: ["{pages,app,components}/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontSize: {
      sm: "1rem",
      md: "1.4rem",
      lg: "1.6rem",
      xl: "2rem",
    },
    minHeight: {
      "1/2": "50%",
    },
    screens: {
      tablet: "640px",
      laptop: "1024px",
      desktop: "1280px",
    },
    extend: {
      colors: {
        periwinkle: {
          50: "#FFF2FF",
          100: "#FDE4FF",
          200: "#F0D6FF",
          300: "#C0A7FF",
          400: "#8080FF",
          500: "#674BE1",
          600: "#5C26B9",
          700: "#4F0E87",
          800: "#37034C",
          900: "#0B000D",
        },
        lightPeaGreen: {
          50: "#e8fcd4",
          100: "#e0fec2",
          200: "#d8ffae",
          300: "#d2ff9e",
          400: "#ceff96",
          500: "#c0ff80",
          600: "#7ebe3e",
          700: "#408000",
          800: "#224400",
          900: "#142600",
        },
        blushPink: {
          50: "#ffd4d4",
          100: "#ffcaca",
          200: "#ffb2b2",
          300: "#ffa2a2",
          400: "#ff9696",
          500: "#ff8080",
          600: "#be3c3c",
          700: "#820000",
          800: "#4c0000",
          900: "#2c0000",
        },
      },
    },
    container: {
      center: true,
    },
  },
  plugins: [],
}
