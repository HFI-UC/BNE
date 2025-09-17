/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1f3a8a',
          light: '#4f46e5',
          dark: '#1e1b4b',
        },
        accent: '#f97316',
      },
    },
  },
  plugins: [],
};
