/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          highlight: '#22d3ee',
          deep: '#3b82f6',
          accent: '#06b6d4',
        },
      },
    },
  },
  plugins: [],
};
