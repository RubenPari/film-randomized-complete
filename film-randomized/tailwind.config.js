/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'film-screen': '#F7F3E8',
        'film-ink': '#15133C',
        'film-blue': '#4856E8',
        'film-yellow': '#FFD166',
        'film-coral': '#FF6B5E',
        success: '#247A5A',
        danger: '#B83A45',
      },
      fontFamily: {
        display: ['Barlow Condensed', 'Arial Narrow', 'sans-serif'],
        sans: ['Manrope', 'system-ui', 'sans-serif'],
        mono: ['IBM Plex Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};
