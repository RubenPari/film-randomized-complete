/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Cinematic dark neutrals
        ink: {
          950: '#08080a',
          900: '#0b0b0d',
          850: '#121214',
          800: '#17171b',
          750: '#1d1d23',
          700: '#26262e',
          600: '#34343f',
          500: '#454552',
        },
        // Warm amber / gold accent
        gold: {
          DEFAULT: '#f0a830',
          soft: '#f7c768',
          deep: '#c47e1a',
        },
        cream: '#f4eee2',
        muted: '#9c9488',
        // Backwards-compat aliases (older components referenced these)
        brand: {
          highlight: '#f7c768',
          deep: '#c47e1a',
          accent: '#f0a830',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      boxShadow: {
        gold: '0 10px 40px -12px rgba(240, 168, 48, 0.35)',
        'gold-lg': '0 20px 60px -15px rgba(240, 168, 48, 0.45)',
        cinema: '0 30px 60px -20px rgba(0, 0, 0, 0.8)',
      },
      backgroundImage: {
        'cinema-backdrop': "url('/images/cinema-backdrop.png')",
      },
    },
  },
  plugins: [],
};
