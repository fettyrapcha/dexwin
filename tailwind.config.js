/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        /** Product brand — primary green */
        brand: {
          50:  '#ecf7f2',
          100: '#d1ebe0',
          200: '#a7d4c3',
          300: '#76b89a',
          400: '#479d77',
          500: '#1d8a5e',
          600: '#096E47',
          700: '#075a3a',
          800: '#05462c',
          900: '#03321f',
        },
        /** Same hue as brand-600 — semantic tokens for DexwinHR screens */
        forest: {
          DEFAULT: '#096E47',
          light: '#0b8558',
          dark: '#075a3a',
        },
        surface: {
          page: '#F9FAFB',
          border: '#E5E7EB',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px 0 rgba(0,0,0,0.07), 0 1px 2px -1px rgba(0,0,0,0.05)',
        'card-hover': '0 4px 12px 0 rgba(0,0,0,0.08)',
      },
    },
  },
  plugins: [],
};
