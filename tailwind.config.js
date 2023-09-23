/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        back: "#08070C",
        primary: "#0d1117",
        secondary: "#212121",
        accent: "#784ED5",
      },
    },
  },
  plugins: [],
};
