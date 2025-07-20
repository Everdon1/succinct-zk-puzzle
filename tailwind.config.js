/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        succinctGold: '#D6AD60',
        succinctBlack: '#0E0E0E'
      }
    }
  },
  plugins: []
}