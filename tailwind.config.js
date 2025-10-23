/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#0b1120',
          card: '#131b2e',
          border: '#1e293b',
          hover: '#1a2540',
        },
        light: {
          bg: '#f5f5f5',
          card: '#ffffff',
          border: '#e5e7eb',
          hover: '#f9fafb',
        },
        nexar: {
          purple: '#5b4b9d',
          purpleHover: '#6d5ba7',
        }
      }
    },
  },
  plugins: [],
}

