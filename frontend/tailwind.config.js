/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0a0a0f',
        brandOrange: '#ff6230',
        brandBlue: '#2563eb', // Trust
        brandGreen: '#10b981', // Growth
        brandPurple: {
          light: '#1f1633',
          dark: '#150f24',
        },
        cardPurple: '#161122'
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'glow-orange': '0 0 40px -10px rgba(255, 98, 48, 0.5)',
      }
    },
  },
  plugins: [],
}
