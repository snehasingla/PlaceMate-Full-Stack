/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class", // Enables dark mode via a CSS class on <html>
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      colors: {
        // Primary brand color — indigo/violet
        brand: {
          50: "#eef2ff",
          100: "#e0e7ff",
          200: "#c7d2fe",
          300: "#a5b4fc",
          400: "#818cf8",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
          800: "#3730a3",
          900: "#312e81",
        },
        // Dark mode surface colors
        dark: {
          bg: "#0f1117",
          surface: "#1a1d27",
          card: "#20232f",
          border: "#2d3148",
        },
      },
    },
  },
  plugins: [],
};
