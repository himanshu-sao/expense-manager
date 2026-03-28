/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/renderer/**/*.{js,ts,jsx,tsx}",
    "./src/renderer/index.html"
  ],
  theme: {
    extend: {
      colors: {
        slate: {
          850: '#1a2332'
        }
      }
    }
  },
  plugins: []
}
