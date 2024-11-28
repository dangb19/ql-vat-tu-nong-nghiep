/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        main: {
          100: "#ffe0d6",
          200: "#ffd1c2",
          300: "#ffc2ad",
          400: "#ffb399",
          500: "#ffa385",
          600: "#ff9470",
          700: "#ff855c",
          800: "#ff7547",
          900: "#ff6633",
          DEFAULT: "#ff6633",
        },
      },
    },
  },
  plugins: [],
};
