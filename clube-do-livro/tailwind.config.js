/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'terracota': '#B8654B',
        'terracota-dark': '#96533C',
        'bege-claro': '#F5E6D3',
        'verde-oliva': '#6B6B47',
        'verde-floresta': '#476B47',
        'dourado': '#D4A574',
        'marrom-escuro': '#4D381B',
      },
      fontFamily: {
        'serif': ['Cormorant Garamond', 'Playfair Display', 'Georgia', 'serif'],
        'sans': ['Montserrat', 'Inter', 'sans-serif'],
        'elegant': ['Cormorant Garamond', 'serif'],
      },
    },
  },
  plugins: [],
}