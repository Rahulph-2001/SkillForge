import defaultTheme from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Outfit"', '"Inter"', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        // Overriding generic blue to match the specific purple brand color from the image
        // This ensures all legacy "blue" components automatically switch to the new theme
        blue: {
          50: '#f5f3ff', // violet-50
          100: '#ede9fe', // violet-100
          200: '#ddd6fe', // violet-200
          300: '#c4b5fd', // violet-300
          400: '#a78bfa', // violet-400
          500: '#8b5cf6', // violet-500
          600: '#7c3aed', // violet-600 (Primary Brand Color)
          700: '#6d28d9', // violet-700
          800: '#5b21b6', // violet-800
          900: '#4c1d95', // violet-900
          950: '#2e1065', // violet-950
        },
        // Explicit primary alias
        primary: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
          950: '#2e1065',
        }
      },
      borderRadius: {
        'lg': '0.75rem',
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        'soft': '0 10px 40px -10px rgba(0,0,0,0.08)',
      }
    },
  },
  plugins: [],
}
