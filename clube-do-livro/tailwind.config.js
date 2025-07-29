/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Cores principais com contraste melhorado
        'terracota': {
          DEFAULT: '#B8654B',
          light: '#C87A60',
          dark: '#96533C',
          darker: '#7A4330', // Novo: melhor contraste em fundos claros
        },
        'terracota-dark': '#96533C', // Mantido para compatibilidade
        'bege-claro': '#F5E6D3',
        'verde-oliva': {
          DEFAULT: '#6B6B47',
          dark: '#555538', // Novo: melhor contraste
        },
        'verde-floresta': {
          DEFAULT: '#476B47',
          dark: '#365436', // Novo: melhor contraste
        },
        'dourado': {
          DEFAULT: '#D4A574',
          dark: '#B8864A', // Novo: melhor contraste em fundos claros
        },
        'marrom-escuro': '#4D381B',
        
        // Cores de texto acessíveis
        'text': {
          'primary': '#1f2937', // gray-800
          'secondary': '#4b5563', // gray-600
          'muted': '#6b7280', // gray-500
          'on-dark': '#f9fafb', // gray-50
        },
      },
      fontFamily: {
        'serif': ['Cormorant Garamond', 'Playfair Display', 'Georgia', 'serif'],
        'sans': ['Montserrat', 'Inter', 'sans-serif'],
        'elegant': ['Cormorant Garamond', 'serif'],
      },
      animation: {
        'fadeIn': 'fadeIn 0.3s ease-in-out',
        'slideIn': 'slideIn 0.3s ease-out',
        'shimmer': 'shimmer 2s infinite',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}