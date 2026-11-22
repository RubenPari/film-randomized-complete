/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#0B0B10',
        surface: '#16161D',
        'surface-2': '#1F1F29',
        fg: '#ECE8DF',
        line: '#FFFFFF24',
        accent: '#F5B544',
        'on-accent': '#1A1204',
        'film-coral': '#FF7A6B',
        success: '#3DBE8B',
        danger: '#F2677A',
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(245, 181, 68, 0.45), 0 8px 28px -6px rgba(245, 181, 68, 0.35)',
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
