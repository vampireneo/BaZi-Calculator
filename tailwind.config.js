/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'ink-white': '#fdfbf7',
        'ink-black': '#333333',
        'ink-red': '#b91c1c',
      },
      fontFamily: {
        'serif': ['Georgia', 'Noto Serif SC', 'serif'],
      },
    },
  },
  plugins: [],
}
